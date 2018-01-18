// for Selenium IDE
// function Log() {
// }

// Log.prototype = console;

this.log = console; // remove Selenium IDE Log

// read test suite from an HTML string
function readSuiteFromString(test_suite) {
    // append on test grid
    var id = "suite" + sideex_testSuite.count;
    sideex_testSuite.count++;
    var suiteName = parseSuiteName(test_suite);
    addTestSuite(suiteName, id);
    // name is used for download
    sideex_testSuite[id] = {
        file_name: suiteName + '.html',
        title: suiteName
    };

    test_case = test_suite.match(/<table[\s\S]*?<\/table>/gi);
    if (test_case) {
        for (var i = 0; i < test_case.length; ++i) {
            readCase(test_case[i]);
        }
    }
}

// parse test suite name from an HTML string
function parseSuiteName(test_suite) {
    var pattern = /<title>(.*)<\/title>/gi;
    var suiteName = pattern.exec(test_suite)[1];
    return suiteName;
}

// load test suite saved in storage upon starting
$(function() {
    chrome.storage.local.get(null, function(result) {
        try {
            if (result.data) {
                if (!result.backup) {
                    var data = {
                        backup: result.data
                    };
                    browser.storage.local.set(data);
                }
                for (var i = 0; i < result.data.length; i++) {
                    readSuiteFromString(result.data[i]);
                }
            }
            if (result.language) {
                $("#select-script-language-id").val(result.language);
            }
        } catch (e) {
            console.error(e);
        }
    });
});

// get content of a test suite as an HTML string
function getContentOfTestSuite(s_suite) {
    var cases = s_suite.getElementsByTagName("p"),
    output = "",
    old_case = getSelectedCase();
    for (var i = 0; i < cases.length; ++i) {
        setSelectedCase(cases[i].id);
        saveNewTarget();
        output = output +
            '<table cellpadding="1" cellspacing="1" border="1">\n<thead>\n<tr><td rowspan="1" colspan="3">' +
            sideex_testCase[cases[i].id].title +
            '</td></tr>\n</thead>\n' +
            panelToFile(document.getElementById("records-grid").innerHTML) +
            '</table>\n';
    }
    output = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' +
        'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:' +
        'lang="en" lang="en">\n<head>\n\t<meta content="text/html; charset=UTF-8" http-equiv="content-type" />\n\t<title>' +
        sideex_testSuite[s_suite.id].title +
        '</title>\n</head>\n<body>\n' +
        output +
        '</body>\n</html>';

    if (old_case) {
        setSelectedCase(old_case.id);
    } else {
        setSelectedSuite(s_suite.id);
    }

    return output;
}

// save all test suite to an array
function storeAllTestSuites() {
    var suites = document.getElementById("testCase-grid").getElementsByClassName("message");
    var length = suites.length;
    var data = [];
    for (var i=0; i<length; i++) {
        if (suites[i].id.includes("suite")) {
            var suite = suites[i];
            var content = getContentOfTestSuite(suite);
            data.push(content);
        }
    }
    return data;
}

// store window size upon resizing
$(window).on('resize', function() {
    var data = {
        window: {
            width: window.outerWidth,
            height: window.outerHeight
        }
    };
    browser.storage.local.set(data);
});

// save last selected language
function saveSetting() {
    try {
        var data = {
            language: $("#select-script-language-id").val()
        };
        browser.storage.local.set(data);
    } catch (e) {
        console.log(e);
    }
}

// save test suite to storage
function saveData() {
    try {
        var s_suite = getSelectedSuite();
        var s_case = getSelectedCase();
        var data = {
            data: storeAllTestSuites()
        };
        browser.storage.local.set(data);
        if (s_suite) {
            setSelectedSuite(s_suite.id);
        }
        if (s_case) {
            setSelectedCase(s_case.id);
        }
    } catch (e) {
        console.log(e);
    }
}

// save test suite before exiting
window.addEventListener('beforeunload', function(e) {
    saveData();
});

// load all Selenium IDE command
function _loadSeleniumCommands() {
    var commands = [];
    
    var nonWaitActions = ['open', 'selectWindow', 'chooseCancelOnNextConfirmation', 'answerOnNextPrompt', 'close', 'setContext', 'setTimeout', 'selectFrame'];
    
    for (func in Selenium.prototype) {
        //this.log.debug("func=" + func);
        var r;
        if (func.match(/^do[A-Z]/)) {
            var action = func.substr(2,1).toLowerCase() + func.substr(3);
            commands.push(action);
            if (!action.match(/^waitFor/) && nonWaitActions.indexOf(action) < 0) {
                commands.push(action + "AndWait");
            }
        } else if (func.match(/^assert.+/)) {
            commands.push(func);
            commands.push("verify" + func.substr(6));
        } else if ((r = func.match(/^(get|is)(.+)$/))) {
            var base = r[2];
            commands.push("assert" + base);
            commands.push("verify" + base);
            commands.push("store" + base);
            commands.push("waitFor" + base);
            var r2;
            if ((r = func.match(/^is(.*)Present$/))) {
                base = r[1];
                commands.push("assert" + base + "NotPresent");
                commands.push("verify" + base + "NotPresent");
                commands.push("waitFor" + base + "NotPresent");
            } else {
                commands.push("assertNot" + base);
                commands.push("verifyNot" + base);
                commands.push("waitForNot" + base);
            }
        }
    }
    
    commands.push("pause");
    commands.push("store");
    commands.push("echo");
    commands.push("break");

    commands.sort();

    var uniqueCommands = [];
    var previousCommand = null;
    for (var i = 0; i < commands.length; i++) {
        var currentCommand = commands[i];
        if (previousCommand != currentCommand) {
            uniqueCommands.push(currentCommand);
        }
        previousCommand = currentCommand;
    }
    return uniqueCommands;
}

// load Selenium IDE command reference
$(function() {
    $.ajax({
        url: 'js/katalon/selenium-ide/iedoc-core.xml',
        success: function (document) {
            Command.apiDocuments = new Array(document);
        },
        async: false,
        dataType: 'xml'
    });
});

// get a command reference
function scrape(word){
    emptyNode(document.getElementById("refercontainer"));
    var command = new Command(word);
    var def = command.getDefinition();
    help_log.logHTML((def) ? def.getReferenceFor(command): '');
    $('#tab4.case_roll').scrollTop(0);
}

// modify and add handler for command grid toolbar buttons
$(function() {
    $('#grid-add-btn').on('click', function(event) {
        $('#grid-add').click();
    });

    $('#grid-delete-btn').on('click', function(event) {
        $('#grid-delete').click();
    });

    $('#grid-copy-btn').on('click', function(event) {
        $('#grid-copy').click();
    });

    $('#grid-paste-btn').on('click', function(event) {
        $('#grid-paste').click();
    });

    //move select and find buttons to the toolbar using js in order not to modify HTML
    // var pasteButton = $('#grid-paste-btn');
    // var selectElementButton = $('#selectElementButton');
    // var showElementButton = $('#showElementButton');
    // selectElementButton.removeClass('btn_sf');
    // showElementButton.removeClass('btn_sf');
    // pasteButton.after(showElementButton).after(selectElementButton);
    // $('#command-target').css('width', 'calc(100% - 90px)');
    var selectElementButton = $('#selectElementButton');
    var showElementButton = $('#showElementButton');
    selectElementButton.text("");
    showElementButton.text("");
});

//add context menu button for test suite/case
function addContextMenuButton(id, node, menu, isCase) {
    var buttonWrapper = document.createElement('div');
    buttonWrapper.innerHTML = '<button class="btn-more"><img src="/katalon/images/SVG/more-icon.svg" alt="More" title="More"></button>';
    var button = buttonWrapper.firstChild;
    node.appendChild(button);
    button.addEventListener("click", function(event) {
        if (isCase) {
            setSelectedCase(id);
        } else {
            setSelectedSuite(id);
        }
        var mid = "#" + "menu" + id;
        $(".menu").css("left", event.pageX);
        $(".menu").css("top", event.pageY);
        $(mid).show();
    }, false);
}
//KAT-END


// export test case as script
function saveAsFileOfTestCase(fileName, content) {
    var link = makeTextFile(content);
    var downloading = browser.downloads.download({
        filename: fileName,
        url: link,
        saveAs: true,
        conflictAction: 'overwrite'
    });
    var result = function(id) {
        browser.downloads.onChanged.addListener(function downloadCompleted(downloadDelta) {
            if (downloadDelta.id == id && downloadDelta.state &&
                downloadDelta.state.current == "complete") {
                $( "#generateToScriptsDialog" ).dialog("close");
            } else if (downloadDelta.id == id && downloadDelta.error) {
                browser.downloads.onChanged.removeListener(downloadCompleted);
            }
        })
    };
    var onError = function(error) {
        console.log(error);
    };
    downloading.then(result, onError);
}

$(function() {
    $("#export").click(function() {
        handleGenerateToScript();
    });
    
    $("#select-script-language-id").change(function() {
        handleGenerateToScript();
        saveSetting();
    });
})

function handleGenerateToScript() {
    var selectedTestCase = getSelectedCase();
    if (selectedTestCase) {
        var language = $("#select-script-language-id").val();
        loadScripts(language, generateScripts);
    } else {
        alert('Please select a testcase');
    }
}

function copyToClipboard() {
    $("#txt-script-id").show();
    $("#txt-script-id").select();
    document.execCommand("copy");
    $("#txt-script-id").hide();
}

function saveToFile() {
    var $textarea = $("#txt-script-id");
    var cm = $textarea.data('cm');
    var format = '.' + options.defaultExtension;
    var fileName = testClassName(getTestCaseName()) + format;
    var content = cm.getValue();
    saveAsFileOfTestCase(fileName, content);
}

$(function() {
    $( "#generateToScriptsDialog" ).dialog({
        autoOpen: false,
        modal: true,
        height: 600,
        width: '90%',
        buttons: {
            "Copy to Clipboard": copyToClipboard,
            "Save As File...": saveToFile,
            Close: function() {
                $(this).dialog("close");
            }
        }
    });
});

function getCommandsToGenerateScripts() {
    var ret = [];
    let commands = getRecordsArray();
    for (var index=0; index<commands.length; index++) {
        let commandName = getCommandName(commands[index]);
        let commandTarget = getCommandTarget(commands[index]);
        let commandValue = getCommandValue(commands[index]);

        ret.push(new Command(commandName, commandTarget, commandValue));
    }
    return ret;
}

function loadScripts(language, callback) {
    var scriptNames = [];
    switch (language) {
        case 'cs-wd-nunit':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/csharp/cs-rc.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/csharp/cs-wd.js"
            ];
            break;
        case 'cs-wd-mstest':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/csharp/cs-rc.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/csharp/cs-wd.js",
                "js/katalon/selenium-ide/format/csharp/cs-mstest-wd.js"
            ];
            break;
        case 'katalon':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                "js/katalon/selenium-ide/format/java/java-backed-junit4.js",
                "js/katalon/selenium-ide/format/katalon/katalon.js"
            ];
            break;
        case 'java-wd-testng':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/java/webdriver-testng.js"
            ];
            break;
        case 'java-wd-junit':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/java/webdriver-junit4.js"
            ];
            break;
        case 'java-rc-junit':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/java/java-rc.js",
                "js/katalon/selenium-ide/format/java/java-rc-junit4.js",
                "js/katalon/selenium-ide/format/java/java-rc-testng.js",
                "js/katalon/selenium-ide/format/java/java-backed-junit4.js"
            ];
            break;
        case 'python2-wd-unittest':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/python/python2-rc.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/python/python2-wd.js"
            ];
            break;
        case 'robot':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/format/robot/robot.js'
            ];
            break;
        case 'ruby-wd-rspec':
            scriptNames = [
                'js/katalon/selenium-ide/formatCommandOnlyAdapter.js',
                'js/katalon/selenium-ide/remoteControl.js',
                "js/katalon/selenium-ide/format/ruby/ruby-rc.js",
                "js/katalon/selenium-ide/format/ruby/ruby-rc-rspec.js",
                'js/katalon/selenium-ide/webdriver.js',
                "js/katalon/selenium-ide/format/ruby/ruby-wd-rspec.js"
            ];
            break;
    }

    $("[id^=formatter-script-language-id-]").remove();
    var j = 0;
    for (var i = 0; i < scriptNames.length; i++) {
        var script = document.createElement('script');
        script.id = "formatter-script-language-id-" + language + '-' + i;
        script.src = scriptNames[i];
        script.async = false; // This is required for synchronous execution
        script.onload = function() {
            j++;
        }
        document.head.appendChild(script);
    }
    var interval = setInterval(
        function() {
            if (j == scriptNames.length) {
                clearInterval(interval);
                callback();
            }
        },
        100
    );
}

function displayOnCodeMirror(outputScript) {
    var $textarea = $("#txt-script-id");
    $textarea.val(outputScript);  
    var textarea = $textarea.get(0);

    var language = $("#select-script-language-id").val();
    var mode;
    switch (language) {
        case 'cs-wd-nunit':
        case 'cs-wd-mstest':
            mode = 'text/x-csharp';
            break;
        case 'katalon':
            mode = 'text/x-groovy';
            break;
        case 'java-wd-testng':
        case 'java-wd-junit':
        case 'java-rc-junit':
            mode = 'text/x-java';
            break;
        case 'python2-wd-unittest':
            mode = 'text/x-python';
            break;
        case 'robot':
            break;
        case 'ruby-wd-rspec':
            mode = 'text/x-ruby';
            break;
    }
    var options = {
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true,
        lineWrapping: true
    };
    if (mode) {
        options.mode = mode;
    }
    var cm = CodeMirror.fromTextArea(textarea, options);
    $textarea.data('cm', cm);
}

function getTestCaseName() {
    var selectedTestCase = getSelectedCase();
    return sideex_testCase[selectedTestCase.id].title;
}

function generateScripts() {
    var $textarea = $("#txt-script-id");
    var cm = $textarea.data('cm');
    if (cm) {
        cm.toTextArea();
    }
    $textarea.data('cm', null);
    $("#generateToScriptsDialog").dialog("open");
    let commands = getCommandsToGenerateScripts();
    var name = getTestCaseName();
    var testCase = new TestCase(name);
    testCase.commands = commands;
    testCase.formatLocal(name).header = "";
    testCase.formatLocal(name).footer = "";
    displayOnCodeMirror(format(testCase, name)); 

    var language = $("#select-script-language-id").val();
    if (language == 'katalon') {
        $('.kat').show();
        $('.CodeMirror').removeClass('kat-90').removeClass('kat-75').addClass('kat-75');
    } else {
        $('.kat').hide();
        $('.CodeMirror').removeClass('kat-75').removeClass('kat-90').addClass('kat-90');
    }
}
// KAT-END

// KAT-BEGIN Show/hide bottom panel
$(function() {
    $('#show-hide-bottom-panel').click(function (e) {
        e.stopPropagation();
        var $bottomContent = $('#tab4');
        $bottomContent.toggle();
        var $icon = $("#show-hide-bottom-panel img");
        // total height = 100% - 20px (toolbar)
        if ($bottomContent.is(":hidden")) {
            $('.width_quarter').css("height", "calc(100% - 62px)");
            $('.width_3_quarter').css("height", "calc(100% - 62px)");
            $('.width_full').css("height", "38px");
            $(this).parent().get(0).title = "Show";
            $icon.attr("src", $icon.data("show"));
        } else {
            $('.width_quarter').css("height", "calc(70% - 24px)");
            $('.width_3_quarter').css("height", "calc(70% - 24px)");
            $('.width_full').css("height", "30%");
            $(this).parent().get(0).title = "Hide";
            $icon.attr("src", $icon.data("hide"));
        }
    });
});
// KAT-END

// KAT-BEGIN styling log/reference when clicked
$(function() {
    var logLi = $('#history-log');
    var referenceLi = $('#reference-log');
    var variableLi = $('#variable-log');
    var logContainer = $('#logcontainer');
    var referenceContainer = $('#refercontainer');
    var variableContainer = $('#variablecontainer');
    var clearLog = $('#clear-log');
    logLi.addClass("active");
    logContainer.show();
    referenceContainer.hide();
    variableContainer.hide();
    logLi.on("click", function() {
        logLi.addClass("active");
        referenceLi.removeClass("active");
        variableLi.removeClass("active");
        logContainer.show();
        referenceContainer.hide();
        variableContainer.hide();
        clearLog.parent().show();
    });
    referenceLi.on("click", function() {
        logLi.removeClass("active");
        referenceLi.addClass("active");
        variableLi.removeClass("active");
        logContainer.hide();
        referenceContainer.show();
        variableContainer.hide();
        clearLog.parent().hide();
    });
    variableLi.on("click", function() {
        logLi.removeClass("active");
        referenceLi.removeClass("active");
        variableLi.addClass("active");
        logContainer.hide();
        referenceContainer.hide();
        variableContainer.show();
        clearLog.parent().hide();
    });
});
// KAT-END

// KAT-BEGIN handle click event for settings button
$(function() {
    $('#settings').on('click', function() {
        browser.windows.update(
            contentWindowId,
            { focused: true }
        );
        chrome.tabs.create({
            url: chrome.extension.getURL('katalon/options.html'),
            windowId: contentWindowId
        }, function(tab){});
    });
});
// KAT-END

// KAT-BEGIN add tooltip for button
$(function() {
    $('#record').attr('title', "Click and navigate to the desired browser tab and record your tests. If the tab has been opened before Katalon Recorder was installed, please refresh it.");
    $('#playback').attr('title', "Run selected test case on the active tab, any interference may stop the process. If the tab has been opened before Katalon Recorder was installed, please refresh it.");
    $('#playSuite').attr('title', "Run selected test suite on the active tab, any interference may stop the process. If the tab has been opened before Katalon Recorder was installed, please refresh it.");
    $('#playSuites').attr('title', "Run all test suites on the active tab, any interference may stop the process. If the tab has been opened before Katalon Recorder was installed, please refresh it.");
    $('#settings').attr('title', "Settings");
    $('.sub_btn#help').attr('title', "Help");
    $('#grid-add-btn').attr('title', "Add new test step");
    $('#grid-delete-btn').attr('title', "Delete the current test step");
    $('#grid-copy-btn').attr('title', "Copy the current test step");
    $('#grid-paste-btn').attr('title', "Paste the copied test step as the next step of the current one");
    $('#selectElementButton').attr('title', "Select a target element for the current command");
    $('#showElementButton').attr('title', "Find and highlight the curent target element of the current command");
    $('#speed').attr('title', "Adjust play speed");
    $('#new').attr('title', "Create new test case");
    $('#export').attr('title', "Export the current test case to script in C#, Java, Ruby, Python, (Katalon Studio) Groovy, or Robot Framework");
})
// KAT-END

// KAT-BEGIN modify log
// $(function() {
//     var logContainer = document.getElementById('logcontainer');
    
//     var callback = function(mutationList) {
//         for (var mutation of mutationList) {
//             if (mutation.type == "childList") {
//                 var nodes = mutation.addedNodes;
//                 for (var i = 0; i < nodes.length; i++) {
//                     var node = nodes[i];
//                     var text = node.textContent;
//                     if (node.className.indexOf('log-info') != -1) {
//                         text = "[INFO]  " + text.substring("[info] ".length);
//                     } else if (node.className.indexOf('log-error') != -1) {
//                         text = "[ERROR] " + text.substring("[error] ".length);
//                     }

//                     if (text.includes("Executing:")) {
//                         text = text.substring(0, text.indexOf("|")) + text.substring(text.indexOf("|") + 1, text.lastIndexOf("|"));
//                     }
//                     node.textContent = text;
//                 }
//             }
//         }
//     }

//     var observer = new MutationObserver(callback);
//     observer.observe(logContainer, { childList: true });
// })
// KAT-END

// KAT-BEGIN add pulse animation for record button 
$(function() {
    var record = $('.sub_btn#record');
    record.on('click', function() {
        if (record.text().trim() === "Stop") {
            switchRecordButton(false);
        } else {
            switchRecordButton(true);
        }
    });
})
// KAT-END

$(function() {
    var slider = $('#slider');
    var sliderContainer = $('#slider-container');
    var speedButton = $('#speed');

    slider.slider({
        min: 0,
        max: 3000,
        value: 0,
        step: 600,
        orientation: 'vertical'
    }).slider("pips", {
        rest: "label", labels: ["Fast", "", "", "", "", "Slow"]
    });
    sliderContainer.append(slider);
    slider.show();

    speedButton.on("click", function() {
        sliderContainer.toggle();
    });
})
// KAT-END

// KAT-BEGIN log variables
function handleDisplayVariables() {
    var varGridBody = $('#variable-grid tbody');
    varGridBody.empty();
    for (var variable in declaredVars) {
        var cellName = $('<td></td>');
        cellName.text(variable);
        var cellValue = $('<td></td>');
        cellValue.text(declaredVars[variable]);
        cellValue.attr('title', declaredVars[variable]);
        var row = $('<tr></tr>');
        row.append(cellName);
        row.append(cellValue);
        varGridBody.append(row);
    }
}
// KAT-END

// KAT-BEGIN add handler for button "New" click event
$(function() {
    $('#new').on('click', function() {
        saveOldCase();
        $('#add-testCase').click();
    });
});
// KAT-END

// KAT-BEGIN modify toolbar buttons
$(function() {
    // var record = $('#record');
    // var newCase = $('#new');
    // record.after(newCase);

    var imagesLookup = {
        '#record': 'record-icon-16.svg',
        '#new': 'new-icon-16.svg',
        '#playback': 'play-icon-16.svg',
        '#stop': 'stop-icon-16.svg',
        '#playSuite': 'play-suite-icon-16.svg',
        '#playSuites': 'play-all-icon-16.svg',
        '#pause': 'pause-icon-16.svg',
        '#resume': 'resume-icon-16.svg',
        '#export': 'export-icon-16.svg',
        '#speed': 'speed-icon-16.svg',
        '#settings': 'setting-icon-16.svg',
        ".sub_btn#help": 'help-icon-16.svg'
    }

    for (var buttonId in imagesLookup) {
        if (imagesLookup.hasOwnProperty(buttonId)) {
            var button = $(buttonId);
            var img = $('<img>');
            img.attr('src', '/katalon/images/SVG/' + imagesLookup[buttonId]);
            button.find("i:first-child").remove();
            button.prepend(img);
        }
    }
});
// KAT-END

$(function() {
    var manifestData = chrome.runtime.getManifest();
    $(document).attr('title', 'Katalon Automation Recorder ' + manifestData.version)
});

// KAT-BEGIN clear "Save" and "Clear" text
$(function() {
    var saveLog = $('#save-log a');
    var clearLog = $('#clear-log a');
   
    saveLog.empty();
    clearLog.empty();
})
// KAT-END


function switchRecordButton(setting) {
    var record = $('#record');
    if (setting) {
        record.find('img').attr('src', '/katalon/images/SVG/record-icon-16.svg');
        record.removeClass("record--stop");
    } else {
        record.find('img').attr('src', '/katalon/images/SVG/stop-icon-16.svg');
        record.addClass("record--stop");
    }
}

// KAT-BEGIN disable event propagation when double clicking command toolbar fieldset
$(function() {
    $('#command-toolbar .fieldset').on("dblclick", function(event) {
        event.stopPropagation();
    });
})
// KAT-END