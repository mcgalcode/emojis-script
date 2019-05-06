(
  function() {

    function sleepThenExecute(functionToExec, sleepTime) {
      setTimeout(function() {
        functionToExec();
      }, sleepTime);
    }

    function shenanigans(params) {
      var startIdx = params.startIdx
      var stopIdx = params.stopIdx
      var targetSectionText = params.targetSectionText;
      var interval = params.interval || 300;
      var intervalSpacing = interval / 6;

      // Find the smiley face icon that opens the emoji panel
      var openEmojisElement = document.querySelector(
        "#main > footer > div._3pkkz.copyable-area > div:nth-child(1) > div > div._1x_c3._35Ob4.kQJNA._2-5II._338za > button"
      );
      if (!openEmojisElement) {
        console.error("Unable to locate openEmojisElement"); return;
      }
      openEmojisElement.click();

      sleepThenExecute(function() {
        // Finds all the emoji <span> tags in the chosen section
        function findEmojiIcons() {
          var currentSection = targetSection;
          var icons = [];
          var emojiIconsCollection;

          // Whatsapp switched to having each row of emojis in its own div
          while (currentSection.previousSibling.querySelectorAll("div.hG_iO")[0]) {
            currentSection = currentSection.previousSibling;
            emojiIconsCollection = currentSection.querySelectorAll('span');
            if (emojiIconsCollection.length === 0) {
              console.error("Unable to locate emojiIconsCollection");
              console.log("icons: ", icons)
              return;
            }
            emojiIconsCollection.forEach(function(node) { icons.push(node); })
          }
          return icons;
        }

        // Finds the chosen emoji section
        function findTargetSection() {
          var divTags = document.getElementsByTagName("div");
          var target = null;

          for (var i = 0; i < divTags.length; i++) {
            if (divTags[i].textContent == targetSectionText) {
              target = divTags[i];
              break;
            }
          }

          if (!target) {
            console.error("Unable to locate targetSection"); return;
          }

          return target;
        }

        var targetSection = findTargetSection();
        window.myTargetSection = targetSection;
        var emojiIcons = findEmojiIcons();

        startIdx = startIdx || 0;
        stopIdx = stopIdx || emojiIcons.length - 1;

        if (startIdx < 0 || stopIdx > emojiIcons.length - 1 || startIdx > stopIdx) {
          console.error(
            "start and stop indices [" +
            [startIdx, stopIdx] +
            "] out of bounds [0, " +
            (emojiIcons.lenth - 1) + "]"
          );
        }

        var sendMessageButton;
        var numInvocations = -1;
        // Dictates when to stop looping, e.g. how many emojis to send
        var targetInvocationCount = stopIdx - startIdx;

        var emojiLoopInterval = setInterval(function() {
          numInvocations += 1;
          if (numInvocations === targetInvocationCount) {
            clearInterval(emojiLoopInterval)
          };

          var emojiClickInterval = sleepThenExecute(function() {
            emojiIcons[startIdx + numInvocations].click();
          }, intervalSpacing * 1)

          var sendEmojiInterval = sleepThenExecute(function() {
            sendMessageButton = document.getElementsByClassName('_35EW6')[0];
            if (!sendMessageButton) {
              console.error("Unable to locate sendMessageButton"); clearInterval(interval); return;
              clearInterval(emojiLoopInterval);
            } else {
              sendMessageButton.click();
            }
          }, intervalSpacing * 2)

          var reopenEmojisInterval = sleepThenExecute(function() {
            if (numInvocations === targetInvocationCount) return;
            openEmojisElement.click();
          }, intervalSpacing * 3);

          var refindTargetSectionInterval = sleepThenExecute(function() {
            if (numInvocations === targetInvocationCount) return;
            targetSection = findTargetSection();
          }, intervalSpacing * 4);

          var refindEmojiIconsInterval = sleepThenExecute(function() {
            if (numInvocations === targetInvocationCount) return;
            emojiIcons = findEmojiIcons();
          }, intervalSpacing * 5);

        }, intervalSpacing * 6)

      }, 500);

    }

    shenanigans({
      startIdx: 0,
      stopIdx: 99,
      targetSectionText: 'Animals & Nature',
      interval: 300 // ms
    });
  }
)();