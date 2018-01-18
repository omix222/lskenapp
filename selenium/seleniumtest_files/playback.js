/*
 * Copyright 2017 SideeX committers
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
var currentPlayingCommandIndex = -1;

var currentTestCaseId = "";
var isPause = false;
var pauseValue = null;
var isPlayingSuite = false;
var isPlayingAll = false;
var selectTabId = null;
var isSelecting = false;

var commandType = "";
var pageCount = 0;
var pageTime = "";
var ajaxCount = 0;
var ajaxTime = "";
var domCount = 0;
var domTime = "";
var implicitCount = 0;
var implicitTime = "";

var caseFailed = false;
var extCommand = new ExtCommand();

// TODO: move to another file
window.onload = function() {
    var recordButton = document.getElementById("record");
    var playButton = document.getElementById("playback");
    var stopButton = document.getElementById("stop");
    var pauseButton = document.getElementById("pause");
    var resumeButton = document.getElementById("resume");
    var playSuiteButton = document.getElementById("playSuite");
    var playSuitesButton = document.getElementById("playSuites");
    var showElementButton = document.getElementById("showElementButton")
    var selectElementButton = document.getElementById("selectElementButton");
    var suitePlus = document.getElementById("suite-plus");
    var suiteOpen = document.getElementById("suite-open");
    /*var recordButton = document.getElementById("record");*/
    //element.addEventListener("click",play);
    //Tim
    var referContainer=document.getElementById("refercontainer");
    var logContainer=document.getElementById("logcontainer");
    var saveLogButton=document.getElementById("save-log");
    
    
    saveLogButton.addEventListener("click",savelog);
    referContainer.style.display="none";
    $('#command-command').on('input change', function() {
        scrape(document.getElementById("command-command").value);
    });
   
    suitePlus.addEventListener("mouseover", mouseOnSuiteTitleIcon);
    suitePlus.addEventListener("mouseout", mouseOutSuiteTitleIcon);
    suiteOpen.addEventListener("mouseover", mouseOnSuiteTitleIcon);
    suiteOpen.addEventListener("mouseout", mouseOutSuiteTitleIcon);
    
    var logLi=document.getElementById("history-log");
    var referenceLi=document.getElementById("reference-log");
    var logState=true;
    var referenceState=false;
    /* KAT-BEGIN remove Sideex styling and event handler for log/reference
    referenceLi.firstChild.style.color="#818181";
    logLi.addEventListener("mouseover",function(){
        logLi.firstChild.style.color="#000000";
    })
    logLi.addEventListener("mouseout",function(){
        if(logState)
            logLi.firstChild.style.color="#333333";
        else 
            logLi.firstChild.style.color="#818181"
    })
    referenceLi.addEventListener("mouseover",function(){
        referenceLi.firstChild.style.color="#000000";
    })
    referenceLi.addEventListener("mouseout",function(){
        if(referenceState)
            referenceLi.firstChild.style.color="#333333";
        else 
            referenceLi.firstChild.style.color="#818181"
    })
    
    logLi.addEventListener("click",function(){       
        if(logState==false){
            document.getElementById("clear-log").parentElement.style.display="inline";
           
            logContainer.style.display="inline";
            referContainer.style.display="none";
            logLi.firstChild.style.color="#333333";
            referenceLi.firstChild.style.color="#818181";
            logState=true;
            referenceState=false;
        }
    })
    referenceLi.addEventListener("click",function(){
        if(referenceState==false){
            document.getElementById("clear-log").parentElement.style.display="none";
           
            scrape(document.getElementById("command-command").value);
            referContainer.style.display="inline";
            logContainer.style.display="none";
            referenceLi.firstChild.style.color="#333333";
            logLi.firstChild.style.color="#818181";
            referenceState=true;
            logState=false;
        }
    })
    KAT-END */

    recordButton.addEventListener("click", function(){
        isRecording = !isRecording;
        if (isRecording) {
            recorder.attach();
            notificationCount = 0;
            // KAT-BEGIN focus on window when recording
            if (contentWindowId) {
                browser.windows.update(contentWindowId, {focused: true});
            }
            // KAT-END
            browser.tabs.query({windowId: extCommand.getContentWindowId(), url: "<all_urls>"})
            .then(function(tabs) {
                for(let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {attachRecorder: true});
                }
            });
            // KAT-BEGIN add space for record button label
            recordButton.childNodes[1].textContent = " Stop";
            // KAT-END
        }
        else {
            recorder.detach();
            browser.tabs.query({windowId: extCommand.getContentWindowId(), url: "<all_urls>"})
            .then(function(tabs) {
                for(let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, {detachRecorder: true});
                }
            });
            // KAT-BEGIN add space for record button label
            recordButton.childNodes[1].textContent = " Record";
            // KAT-END
        }
    })
    playButton.addEventListener("click", function() {
        saveData();
        emptyNode(document.getElementById("logcontainer"));
        document.getElementById("result-runs").textContent = "0";
        document.getElementById("result-failures").textContent = "0";
        recorder.detach();
        initAllSuite();
        setCaseScrollTop(getSelectedCase());
        // KAT-BEGIN focus on window when playing test case
        if (contentWindowId) {
            browser.windows.update(contentWindowId, {focused: true});
        }
        // KAT-END
        play();
    });
    stopButton.addEventListener("click", function() {
        stop();
    });
    pauseButton.addEventListener("click", pause);
    resumeButton.addEventListener("click", resume);
    playSuiteButton.addEventListener("click", function() {
        saveData();
        emptyNode(document.getElementById("logcontainer"));
        document.getElementById("result-runs").textContent = "0";
        document.getElementById("result-failures").textContent = "0";
        recorder.detach();
        initAllSuite();
        // KAT-BEGIN focus on window when playing test suite
        if (contentWindowId) {
            browser.windows.update(contentWindowId, {focused: true});
        }
        // KAT-END
        playSuite(0);
    });
    playSuitesButton.addEventListener("click", function() {
        saveData();
        emptyNode(document.getElementById("logcontainer"));
        document.getElementById("result-runs").textContent = "0";
        document.getElementById("result-failures").textContent = "0";
        recorder.detach();
        initAllSuite();
        // KAT-BEGIN focus on window when playing test suite
        if (contentWindowId) {
            browser.windows.update(contentWindowId, {focused: true});
        }
        // KAT-END
        playSuites(0);
    });
    selectElementButton.addEventListener("click",function(){
        var button = document.getElementById("selectElementButton");
        if (isSelecting) {
            isSelecting = false; 
            // KAT-BEGIN hide button label and remove active class
            // button.textContent = "Select";
            button.classList.remove("active");
            // KAT-END
            browser.tabs.query({
                active: true,
                windowId: contentWindowId
            }).then(function(tabs) {
                browser.tabs.sendMessage(tabs[0].id, {selectMode: true, selecting: false});
            }).catch(function(reason) {
                console.log(reason);
            })
            return;
        }

        isSelecting = true;
        if (isRecording)
            recordButton.click();
        // KAT-BEGIN hide button label and add active class
        // button.textContent = "Cancel";
        button.classList.add("active")
        // KAT-END
        browser.tabs.query({
            active: true,
            windowId: contentWindowId
        }).then(function(tabs) {
            if (tabs.length === 0) {
                console.log("No match tabs");
                isSelecting = false;
                // KAT-BEGIN hide button label and add active class 
                // button.textContent = "Select";
                button.classList.remove("active");
                // KAT-END
            } else
                browser.tabs.sendMessage(tabs[0].id, {selectMode: true, selecting: true});
        })
    });
    showElementButton.addEventListener("click", function(){
        try{
            var targetValue = document.getElementById("command-target").value;
            if (targetValue == "auto-located-by-tac") {
                targetValue = document.getElementById("command-target-list").options[0].text;
            }
            browser.tabs.query({
                active: true,
                windowId: contentWindowId
            }).then(function(tabs) {
                if (tabs.length === 0) {
                    console.log("No match tabs");
                } else {
                    browser.webNavigation.getAllFrames({tabId: tabs[0].id})
                        .then(function(framesInfo){
                            var frameIds = [];
                            for (let i = 0; i < framesInfo.length; i++) {
                                frameIds.push(framesInfo[i].frameId)
                            }
                            frameIds.sort();
                            var infos = {
                                "index": 0,
                                "tabId": tabs[0].id,
                                "frameIds": frameIds,
                                "targetValue": targetValue
                            };
                            sendShowElementMessage(infos);
                        });
                }
            });
        } catch (e) {
            console.error(e);
        }
    });
};

/**
 * Send the show element message to content script.
 * @param {Object} infos - a necessary infomation object.
 *  - key index {Int}
 *  - key tabId {Int}
 *  - key frameIds {Array}
 *  - key targetValue {String}
 */
function sendShowElementMessage(infos) {
    browser.tabs.sendMessage(infos.tabId, {
        showElement: true,
        targetValue: infos.targetValue
    }, {
        frameId: infos.frameIds[infos.index]
    }).then(function(response) {
        if (response){
            if (!response.result) {
                prepareSendNextFrame(infos);
            } else {
                let text = infos.index == 0 ? "top" : index.toString() + "(id)";
                sideex_log.info("Element is found in " + text + " frame.");
            }
        }
    }).catch(function(error) {
        if(error.message == "Could not establish connection. Receiving end does not exist.") {
            prepareSendNextFrame(infos);
        } else {
            sideex_log.error("Unknown error");
        }
    });
}

function prepareSendNextFrame(infos) {
    if (infos.index == infos.frameIds.length) {
        sideex_log.error("Element is not found.");
    } else {
        infos.index++;
        sendShowElementMessage(infos);
    }
}

// TODO: rename it, should be enableClick()
function disableClick() {
    document.getElementById("pause").disabled = false;
    document.getElementById('testCase-grid').style.pointerEvents = 'none';
    document.getElementById('command-container').style.pointerEvents = 'none';
}

function enableClick() {
    document.getElementById("pause").disabled = true;
    document.getElementById('testCase-grid').style.pointerEvents = 'auto';
    document.getElementById('command-container').style.pointerEvents = 'auto';
}

function cleanCommandToolBar() {
    $("#command-command").val("");
    $("#command-target").val("");
    $("#command-value").val("");
}

function play() {
    declaredVars = {};
    initializePlayingProgress()
        .then(executionLoop)
        .then(finalizePlayingProgress)
        .catch(catchPlayingError);
}

function stop() {

    if (isPause){
        isPause = false;
        switchPR();
    }
    isPlaying = false;
    isPlayingSuite = false;
    isPlayingAll = false;
    switchPS();
    sideex_log.info("Stop executing");
    initAllSuite();
    document.getElementById("result-runs").textContent = "0";
    document.getElementById("result-failures").textContent = "0";
    finalizePlayingProgress();
}

function playAfterConnectionFailed() {
    if (isPlaying) {
        initializeAfterConnectionFailed()
            .then(executionLoop)
            .then(finalizePlayingProgress)
            .catch(catchPlayingError);
    }
}

function initializeAfterConnectionFailed() {
    disableClick();

    isRecording = false;
    isPlaying = true;

    commandType = "preparation";
    pageCount = ajaxCount = domCount = implicitCount = 0;
    pageTime = ajaxTime = domTime = implicitTime = "";

    caseFailed = false;

    currentTestCaseId = getSelectedCase().id;
    var commands = getRecordsArray();

    return Promise.resolve(true);
}

function pause() {
    if (isPlaying) {
        sideex_log.info("Pausing");
        isPause = true;
        isPlaying = false;
        // No need to detach
        // prevent from missing status info
        //extCommand.detach();
        switchPR();
    }
}

function resume() {
    if(currentTestCaseId!=getSelectedCase().id)
        setSelectedCase(currentTestCaseId);
    if (isPause) {
        sideex_log.info("Resuming");
        isPlaying = true;
        isPause = false;
        extCommand.attach();
        switchPR();
        disableClick();
        executionLoop()
            .then(finalizePlayingProgress)
            .catch(catchPlayingError);
    }
}

function initAllSuite() {
    cleanCommandToolBar();
    var suites = document.getElementById("testCase-grid").getElementsByClassName("message");
    var length = suites.length;
    for (var k = 0; k < suites.length; ++k) {
        var cases = suites[k].getElementsByTagName("p");
        for (var u = 0; u < cases.length; ++u) {
            $("#" + cases[u].id).removeClass('fail success');
        }
    }
}

function playSuite(i) {
    isPlayingSuite = true;
    var cases = getSelectedSuite().getElementsByTagName("p");
    var length = cases.length;
    if (i == 0) {
        sideex_log.info("Playing test suite " + sideex_testSuite[getSelectedSuite().id].title);
    }
    if (i < length) {
        setSelectedCase(cases[i].id);
        setCaseScrollTop(getSelectedCase());
        sideex_log.info("Playing test case " + sideex_testCase[cases[i].id].title);
        play();
        nextCase(i);
    } else {
        isPlayingSuite = false;
        switchPS();
    }
}

function nextCase(i) {
    if (isPlaying || isPause) setTimeout(function() {
        nextCase(i);
    }, 500);
    else if(isPlayingSuite) playSuite(i + 1);
}

function playSuites(i) {
    isPlayingAll = true;
    var suites = document.getElementById("testCase-grid").getElementsByClassName("message");
    var length = suites.length;
    if (i < length) {
        if (suites[i].id.includes("suite")) {
            setSelectedSuite(suites[i].id);
            playSuite(0);
        }
        nextSuite(i);
    } else {
        isPlayingAll = false;
        switchPS();
    }
}

function nextSuite(i) {
    if (isPlayingSuite) setTimeout(function() {
        nextSuite(i);
    }, 2000);
    else if(isPlayingAll) playSuites(i + 1);
}

function executeCommand(index) {
    var id = parseInt(index) - 1;
    var commands = getRecordsArray();
    var commandName = getCommandName(commands[id]);
    var commandTarget = getCommandTarget(commands[id]);
    var commandValue = getCommandValue(commands[id]);

    if (commandTarget.includes("d-XPath")) {
        sideex_log.info("Executing: | " + commandName + " | " + getCommandTarget(commands[id], true) + " | " + commandValue + " |");
    } else {
        sideex_log.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
    }	

    initializePlayingProgress(true);

    setColor(id + 1, "executing");

    browser.tabs.query({
            windowId: extCommand.getContentWindowId(),
            active: true
        })
        .then(function(tabs) {
            return browser.tabs.sendMessage(tabs[0].id, {
                commands: commandName,
                target: commandTarget,
                value: commandValue
            }, {
                frameId: extCommand.getFrameId(tabs[0].id)
            })
        })
        .then(function(result) {
            if (result.result != "success") {
                sideex_log.error(result.result);
                setColor(id + 1, "fail");
                if (!result.result.includes("did not match")) {
                    return true;
                }
            } else {
                setColor(id + 1, "success");
            }
        })

    finalizePlayingProgress();
}

function cleanStatus() {
    var commands = getRecordsArray();
    for (var i = 0; i < commands.length; ++i) {
        commands[i].setAttribute("class", "");
        commands[i].getElementsByTagName("td")[0].classList.remove("stopping");
    }
    classifyRecords(1, commands.length);
}

function initializePlayingProgress(isDbclick) {
    disableClick();
    
    isRecording = false;
    isPlaying = true;

    switchPS();

    currentPlayingCommandIndex = -1;

    // xian wait
    pageCount = ajaxCount = domCount = implicitCount = 0;
    pageTime = ajaxTime = domTime = implicitTime = "";

    caseFailed = false;

    currentTestCaseId = getSelectedCase().id;

    if (!isDbclick) {
        $("#" + currentTestCaseId).removeClass('fail success');
    }
    var commands = getRecordsArray();

    cleanStatus();

    return extCommand.init();
}

function executionLoop() {
    let commands = getRecordsArray();
    handleDisplayVariables();

    if (currentPlayingCommandIndex + 1 >= commands.length) {
        if (!caseFailed) {
             setColor(currentTestCaseId, "success");
            // KAT-BEGIN
            // document.getElementById("result-runs").textContent = parseInt(document.getElementById("result-runs").textContent) + 1;
            // KAT-END
            declaredVars = {};
            sideex_log.info("Test case passed");
        } else {
            caseFailed = false;
        }
        return true;
    }

    if (commands[currentPlayingCommandIndex + 1].getElementsByTagName("td")[0].classList.contains("break")
        && !commands[currentPlayingCommandIndex + 1].getElementsByTagName("td")[0].classList.contains("stopping")) {
        commands[currentPlayingCommandIndex + 1].getElementsByTagName("td")[0].classList.add("stopping");
        sideex_log.info("Breakpoint: Stop.");
        pause();
        return Promise.reject("shutdown");
    }

    if (!isPlaying) {
        cleanStatus();
        return Promise.reject("shutdown");
    }

    if (isPause) {
        return Promise.reject("shutdown");
    }

    currentPlayingCommandIndex++;

    if (commands[currentPlayingCommandIndex].getElementsByTagName("td")[0].classList.contains("stopping")) {
        commands[currentPlayingCommandIndex].getElementsByTagName("td")[0].classList.remove("stopping");
    }

    let commandName = getCommandName(commands[currentPlayingCommandIndex]);
    let commandTarget = getCommandTarget(commands[currentPlayingCommandIndex]);
    let commandValue = getCommandValue(commands[currentPlayingCommandIndex]);

    if (commandName == "") {
        return Promise.reject("no command name");
    }

    setColor(currentPlayingCommandIndex + 1, "executing");

    return delay($('#slider').slider("option", "value")).then(function () {
        if (isExtCommand(commandName)) {
            if (commandTarget.includes("d-XPath")) {
                sideex_log.info("Executing: | " + commandName + " | " + getCommandTarget(commands[currentPlayingCommandIndex], true) + " | " + commandValue + " |");
            } else {
                sideex_log.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
            }
            let upperCase = commandName.charAt(0).toUpperCase() + commandName.slice(1);
            return (extCommand["do" + upperCase](commandTarget, commandValue))
               .then(function() {
                    setColor(currentPlayingCommandIndex + 1, "success");
               }).then(executionLoop); 
        } else {
            return doPreparation()
               .then(doPrePageWait)
               .then(doPageWait)
               .then(doAjaxWait)
               .then(doDomWait)
               .then(doCommand)
               .then(executionLoop)
        }
    });
}

function delay(t) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, t)
    });
 }

function finalizePlayingProgress() {
    if (!isPause) {
        enableClick();
        extCommand.clear();
    }
    //console.log("success");
    setTimeout(function() {
        isPlaying = false;
        switchPS();
    }, 500);
}

document.addEventListener("dblclick", function(event) {
    var temp = event.target;
    cleanCommandToolBar();
    while (temp.tagName.toLowerCase() != "body") {
        if (/records-(\d)+/.test(temp.id)) {
            var index = temp.id.split("-")[1];
            recorder.detach();
            executeCommand(index);
        }
        if (temp.id == "command-grid") {
            break;
        } else temp = temp.parentElement;
    }
});

function playDisable(setting) {
    // KAT-BEGIN reset label and icon for record button on playing
    if (setting) {
        document.getElementById("record").childNodes[1].textContent = "Record";
        switchRecordButton(true);
    }
    // KAT-END
    document.getElementById("record").disabled = setting;
    document.getElementById("playback").disabled = setting;
    document.getElementById("playSuite").disabled = setting;
    document.getElementById("playSuites").disabled = setting;
    // KAT-BEGIN set disabled state for new and export button
    document.getElementById("new").disabled = setting;
    document.getElementById("export").disabled = setting;
    // KAT-END
}

function switchPS() {
    if ((isPlaying||isPause)||isPlayingSuite||isPlayingAll) {
        playDisable(true);
        document.getElementById("playback").style.display = "none";
        document.getElementById("stop").style.display = "";
    } else {
        playDisable(false);
        document.getElementById("playback").style.display = "";
        document.getElementById("stop").style.display = "none";
    }
}

function switchPR() {
    if (isPause) {
        // playDisable(true);
        document.getElementById("pause").style.display = "none";
        document.getElementById("resume").style.display = "";
    } else {
        // playDisable(false);
        document.getElementById("pause").style.display = "";
        document.getElementById("resume").style.display = "none";
    }
}

function catchPlayingError(reason) {
    // doCommands is depend on test website, so if make a new page,
    // doCommands funciton will fail, so keep retrying to get connection
    if (isReceivingEndError(reason)) {
        commandType = "preparation";
        setTimeout(function() {
            currentPlayingCommandIndex--;
            playAfterConnectionFailed();
        }, 100);
    } else if (reason == "shutdown") {
        return;
    } else {
        extCommand.clear();
        enableClick();
        sideex_log.error(reason);

        if (currentPlayingCommandIndex >= 0) {
            setColor(currentPlayingCommandIndex + 1, "fail");
        }
        setColor(currentTestCaseId, "fail");
        // KAT-BEGIN 
        // document.getElementById("result-failures").textContent = parseInt(document.getElementById("result-failures").textContent) + 1;
        // KAT-END
        sideex_log.info("Test case failed");

        /* Clear the flag, reset to recording phase */
        /* A small delay for preventing recording events triggered in playing phase*/

        setTimeout(function() {
            isPlaying = false;
            //isRecording = true;
            switchPS();
        }, 500);
    }
}

function doPreparation() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    //console.log("in preparation");
    return extCommand.sendCommand("waitPreparation", "", "")
        .then(function() {
            return true;
        })
}


function doPrePageWait() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    //console.log("in prePageWait");
    return extCommand.sendCommand("prePageWait", "", "")
       .then(function(response) {
           if (response && response.new_page) {
               //console.log("prePageWaiting");
               return doPrePageWait();
           } else {
               return true;
           }
       })
}

function doPageWait() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    //console.log("in pageWait");
    return extCommand.sendCommand("pageWait", "", "")
        .then(function(response) {
            if (pageTime && (Date.now() - pageTime) > 30000) {
                sideex_log.error("Page Wait timed out after 30000ms");
                pageCount = 0;
                pageTime = "";
                return true;
            } else if (response && response.page_done) {
                pageCount = 0;
                pageTime = "";
                return true;
            } else {
                pageCount++;
                if (pageCount == 1) {
                    pageTime = Date.now();
                    sideex_log.info("Wait for the new page to be fully loaded");
                }
                return doPageWait();
            }
        })
}

function doAjaxWait() {
    //console.log("in ajaxWait");
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    return extCommand.sendCommand("ajaxWait", "", "")
        .then(function(response) {
            if (ajaxTime && (Date.now() - ajaxTime) > 30000) {
                sideex_log.error("Ajax Wait timed out after 30000ms");
                ajaxCount = 0;
                ajaxTime = "";
                return true;
            } else if (response && response.ajax_done) {
                ajaxCount = 0;
                ajaxTime = "";
                return true;
            } else {
                ajaxCount++;
                if (ajaxCount == 1) {
                    ajaxTime = Date.now();
                    sideex_log.info("Wait for all ajax requests to be done");
                }
                return doAjaxWait();
            }
        })
}

function doDomWait() {
    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }
    //console.log("in domWait");
    return extCommand.sendCommand("domWait", "", "")
        .then(function(response) {
            if (domTime && (Date.now() - domTime) > 30000) {
                sideex_log.error("DOM Wait timed out after 30000ms");
                domCount = 0;
                domTime = "";
                return true;
            } else if (response && (Date.now() - response.dom_time) < 400) {
                domCount++;
                if (domCount == 1) {
                    domTime = Date.now();
                    sideex_log.info("Wait for the DOM tree modification");
                }
                return doDomWait();
            } else {
                domCount = 0;
                domTime = "";
                return true;
            }
        })
}

function doCommand() {
    let commands = getRecordsArray();
    let commandName = getCommandName(commands[currentPlayingCommandIndex]);
    let commandTarget = getCommandTarget(commands[currentPlayingCommandIndex]);
    let commandValue = getCommandValue(commands[currentPlayingCommandIndex]);
    //console.log("in common");

    if (implicitCount == 0) {
        if (commandTarget.includes("d-XPath")) {
            sideex_log.info("Executing: | " + commandName + " | " + getCommandTarget(commands[currentPlayingCommandIndex], true) + " | " + commandValue + " |");
        } else {
            sideex_log.info("Executing: | " + commandName + " | " + commandTarget + " | " + commandValue + " |");
        }
    }

    if (!isPlaying) {
        currentPlayingCommandIndex--;
        return Promise.reject("shutdown");
    }

    let p = new Promise(function(resolve, reject) {
        let count = 0;
        let interval = setInterval(function() {
            if (!isPlaying) {
                currentPlayingCommandIndex--;
                reject("shutdown");
                clearInterval(interval);
            }
            if (count > 60) {
                sideex_log.error("Timed out after 30000ms");
                reject("Window not Found");
                clearInterval(interval);
            }
            if (!extCommand.getPageStatus()) {
                if (count == 0) {
                    sideex_log.info("Wait for the new page to be fully loaded");
                }
                count++;
            } else {
                resolve();
                clearInterval(interval);
            }
        }, 500);
    });
    return p.then(function() {
            if(commandValue.indexOf("${") !== -1){
                commandValue = convertVariableToString(commandValue);
            }
            if(commandTarget.indexOf("${") !== -1){
                commandTarget = convertVariableToString(commandTarget);
            }
            if (isWindowMethodCommand(commandName))
            {
                return extCommand.sendCommand(commandName, commandTarget, commandValue, true);
            }
            return extCommand.sendCommand(commandName, commandTarget, commandValue);
        })
        .then(function(result) {
            if (result.result != "success") {
                // implicit
                if (result.result.match(/Element[\s\S]*?not found/)) {
                    if (implicitTime && (Date.now() - implicitTime > 10000)) {
                        sideex_log.error("Implicit Wait timed out after 10000ms");
                        implicitCount = 0;
                        implicitTime = "";
                    } else {
                        implicitCount++;
                        if (implicitCount == 1) {
                            sideex_log.info("Wait until the element is found");
                            implicitTime = Date.now();
                        }
                        return doCommand();
                    }
                }

                implicitCount = 0;
                implicitTime = "";
                sideex_log.error(result.result);
                setColor(currentPlayingCommandIndex + 1, "fail");
                setColor(currentTestCaseId, "fail");
                // KAT-BEGIN
                // document.getElementById("result-failures").textContent = parseInt(document.getElementById("result-failures").textContent) + 1;
                // KAT-END
                if (commandName.includes("verify") && result.result.includes("did not match")) {
                    setColor(currentPlayingCommandIndex + 1, "fail");
                } else {
                    sideex_log.info("Test case failed");
                    caseFailed = true;
                    currentPlayingCommandIndex = commands.length;
                }
            } else {
                setColor(currentPlayingCommandIndex + 1, "success");
            }
        })
}

function isReceivingEndError(reason) {
    if (reason == "TypeError: response is undefined" ||
        reason == "Error: Could not establish connection. Receiving end does not exist." ||
        // Below message is for Google Chrome
        reason.message == "Could not establish connection. Receiving end does not exist." ||
        // Google Chrome misspells "response"
        reason.message == "The message port closed before a reponse was received." ||
        reason.message == "The message port closed before a response was received." )
        return true;
    return false;
}

function isWindowMethodCommand(command) {
    if (command == "answerOnNextPrompt"
        || command == "chooseCancelOnNextPrompt"
        || command == "assertPrompt"
        || command == "chooseOkOnNextConfirmation"
        || command == "chooseCancelOnNextConfirmation"
        || command == "assertConfirmation"
        || command == "assertAlert")
        return true;
    return false;
}

function enableButton(buttonId) {
    document.getElementById(buttonId).disabled = false;
}

function disableButton(buttonId) {
    document.getElementById(buttonId).disabled = true;
}

function convertVariableToString(variable){
    let frontIndex = variable.indexOf("${");
    let newStr = "";
    while(frontIndex !== -1){
        let prefix = variable.substring(0,frontIndex);
        let suffix = variable.substring(frontIndex);
        let tailIndex = suffix.indexOf("}");
        let suffix_front = suffix.substring(0,tailIndex + 1);
        let suffix_tail = suffix.substring(tailIndex + 1);
        newStr += prefix + xlateArgument(suffix_front);
        variable = suffix_tail;
        frontIndex = variable.indexOf("${");
    }
    return newStr + variable;
}
