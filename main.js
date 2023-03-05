("use strict");
// this down here is for the refresh of the page

window.onload = function () {
  let selectedCoins = JSON.parse(
    localStorage.getItem("arrayOfObjectsSelected")
  );
  let arrayOfSelectedCoinsNames = [];

  if (localStorage.getItem("arrayOfObjectsSelected")) {
    if (selectedCoins.length > 0) {
      for (let i = 0; i < selectedCoins.length; i++) {
        arrayOfSelectedCoinsNames[i] = selectedCoins[i].key.toUpperCase();
      }

      $(".reportsLink").click(handleReports);
      function handleReports() {
        $(".boxOfme").css("display", "none");
        $("#chartContainer").css("visibility", "visible");
      }

      // .......................................................

      let allDataPoints = [[], [], [], [], []];
      let options = {
        title: {
          text: "Crypto Live",
        },
        axisX: {
          title: "chart updates every 2 secs",
        },
        axisY: {
          suffix: "USD",
        },
        toolTip: {
          shared: true,
        },
        legend: {
          cursor: "pointer",
          verticalAlign: "top",
          fontSize: 22,
          fontColor: "dimGrey",
          itemclick: toggleDataSeries,
        },
        data: objectForGraph(),
      };

      let chart = $("#chartContainer").CanvasJSChart(options);

      function toggleDataSeries(e) {
        if (
          typeof e.dataSeries.visible === "undefined" ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }

      let updateInterval = 2000;
      // initial value
      let yValue1 = 800;
      let yValue2 = 810;
      let yValue3 = 780;
      let yValue4 = 770;
      let yValue5 = 760;
      let time = new Date();
      // .........................
      time.setHours(time.getHours());
      time.setMinutes(time.getMinutes());
      time.setSeconds(time.getSeconds());
      time.setMilliseconds(time.getMilliseconds());

      async function addingData(currency) {
        let dataToReturn = [];
        let dataOdNamesToReturn = [];
        $.ajax({
          type: "GET",
          url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${currency}&tsyms=USD&api_key=2750a90166e22d13f3133839f6e2a05913ca643fa648b6b508033b39dac237f2`,
          success: function (results) {
            for (const [key, value] of Object.entries(results)) {
              dataToReturn.push(value.USD);
              dataOdNamesToReturn.push(key);
            }

            updateChart(100, dataToReturn, arrayOfSelectedCoinsNames);
            // console.log(dataOdNamesToReturn);
          },
        });
      }

      function updateChart(count, returnedData, dataOdNamesToReturn) {
        // console.log(returnedData);
        count = count || 1;
        let deltaY1, deltaY2, deltaY3, deltaY4, deltaY5;
        for (let i = 0; i < count; i++) {
          time.setTime(time.getTime() + 2000);
          deltaY1 = -1 + Math.random() * (1 + 1);
          deltaY2 = -1 + Math.random() * (1 + 1);
          deltaY3 = -1 + Math.random() * (1 + 1);
          deltaY4 = -1 + Math.random() * (1 + 1);
          deltaY5 = -1 + Math.random() * (1 + 1);

          // adding random value and rounding it to two digits.
          yValue1 = returnedData[0];
          yValue2 = returnedData[1];
          yValue3 = returnedData[2];
          yValue4 = returnedData[3];
          yValue5 = returnedData[4];

          // pushing the new values
          allDataPoints[0].push({
            x: time.getTime(),
            y: yValue1,
          });
          allDataPoints[1].push({
            x: time.getTime(),
            y: yValue2,
          });
          allDataPoints[2].push({
            x: time.getTime(),
            y: yValue3,
          });
          allDataPoints[3].push({
            x: time.getTime(),
            y: yValue4,
          });
          allDataPoints[4].push({
            x: time.getTime(),
            y: yValue5,
          });
        }

        // updating legend text with  updated with y Value
        for (let i = 0; i < dataOdNamesToReturn.length; i++) {
          options.data[i].legendText =
            dataOdNamesToReturn[i] + ": " + returnedData[i] + "USD";
        }

        $("#chartContainer").CanvasJSChart().render();
      }
      // generates first set of dataPoints
      setInterval(function () {
        addingData(arrayOfSelectedCoinsNames);
      }, updateInterval);

      function objectForGraph() {
        let html = [];
        for (let i = 0; i < arrayOfSelectedCoinsNames.length; i++) {
          html.push({
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.00USD",
            showInLegend: true,
            name: arrayOfSelectedCoinsNames[i],
            dataPoints: allDataPoints[i],
          });
        }
        html.join("");
        return html;
      }
    }
  }
};

// ....................................................................................

$(async () => {
  // ....................................................................................
  searchBarKeyPressed();

  function searchBarKeyPressed() {
    $("#mySearch").keypress(function () {
      $(".boxOfme").css("display", "none");
      $(this).on("keyup", function () {
        if (localStorage.getItem("arrayOfObjectsFromDataBaseTwo")) {
          let inputCharacter = $(this).val();
          for (let i = 0; i < 50; i++) {
            let data = $("#contentDiv")[0].children[i];
            $(data).removeClass("makeTheCardsDissapear");
          }
          for (let i = 0; i < 50; i++) {
            const nameOfCard =
              $("#contentDiv")[0].children[
                i
              ].children[2].children[0].innerText.toLowerCase();
            let data = $("#contentDiv")[0].children[i];
            if (!nameOfCard.includes(`${inputCharacter}`)) {
              $(data).addClass("makeTheCardsDissapear");
            } else {
              $(data).addClass("checkboxClickEventForSearchingPurpose");
            }
          }
          if ($(this).val().length >= 1) {
            localStorage.setItem("isatkeypressed", true);
          } else {
            if (localStorage.getItem("isatkeypressed")) {
              localStorage.removeItem("isatkeypressed");
            }
          }
        }
      });
    });
  }

  // ....................................................................................
  // .......................local data base................................

  let localStorageAllDataOfCards = "";
  let localStorageArrayOfObjectsFromDataBaseTwo = [];
  let localStorageArrayOfObjectsSelected = [];
  const arrayOfObjectsFromDataBaseTwo = new Map();
  const arrayOfObjectsSelected = new Map();

  updateValuesAfterRefresh();
  function updateValuesAfterRefresh() {
    if (localStorage.getItem("isRefreshed")) {
      if (localStorage.getItem("arrayOfObjectsFromDataBaseTwo")) {
        localStorageArrayOfObjectsFromDataBaseTwo = JSON.parse(
          localStorage.getItem("arrayOfObjectsFromDataBaseTwo")
        );
        for (
          let i = 0;
          i < localStorageArrayOfObjectsFromDataBaseTwo.length;
          i++
        ) {
          let tempDataObject = localStorageArrayOfObjectsFromDataBaseTwo[i];
          arrayOfObjectsFromDataBaseTwo.set(`${tempDataObject.key}`, {
            clicked: tempDataObject.clicked,
            index: tempDataObject.index,
            symbol: tempDataObject.symbol,
          });
        }
      }
      if (localStorage.getItem("arrayOfObjectsSelected")) {
        localStorageArrayOfObjectsSelected = JSON.parse(
          localStorage.getItem("arrayOfObjectsSelected")
        );
        for (let i = 0; i < localStorageArrayOfObjectsSelected.length; i++) {
          let tempDataObject = localStorageArrayOfObjectsSelected[i];
          arrayOfObjectsSelected.set(`${tempDataObject.key}`, {
            clicked: tempDataObject.clicked,
            index: tempDataObject.index,
            symbol: tempDataObject.symbol,
          });
        }
      }
    }
  }
  // .......................................................

  // ....................................................................................
  afterRefresh();
  function afterRefresh() {
    if (localStorage.getItem("isRefreshed")) {
      if (localStorage.getItem("localStorageAllDataOfCards")) {
        const contentDiv = $("#contentDiv");
        let html = JSON.parse(
          localStorage.getItem("localStorageAllDataOfCards")
        );
        contentDiv.html(html);
        dataForTableDropdDownEvent();
        checkboxClickEvent();

        let localDataBaseStorage = JSON.parse(
          localStorage.getItem("arrayOfObjectsFromDataBaseTwo")
        );

        let arrayOfNamesClicked = [];
        for (let i = 0; i < localDataBaseStorage.length; i++) {
          if (localDataBaseStorage[i].clicked) {
            arrayOfNamesClicked[i] = localDataBaseStorage[i].symbol;
          }
        }
        // here i need to trivers with this $(".checkbox-input")[0]
        for (let i = 5; i < localDataBaseStorage.length; i++) {
          let symbolOfCard =
            $(".checkbox-input")[
              i
            ].parentElement.parentElement.children[2].children[0].innerText.toLowerCase();
          for (let j = 0; j < arrayOfNamesClicked.length; j++) {
            if (symbolOfCard === arrayOfNamesClicked[j]) {
              $(".checkbox-input")[i].checked = true;
            }
          }
        }
      }
    }
  }
  // ....................................................................................
  // it worked an 568 screen size
  // down here are the adjustments for the navbar when the screen size changes
  window.addEventListener("resize", () => {
    if (window.innerWidth > 658) {
      if ($("header").hasClass("open")) {
        selector("header").classList.toggle("open");
        selector(".overlay").classList.toggle("open");
        $(".menu").toggleClass("open");
        $("nav").toggleClass("shiftZIndexBack");

        $(".cardBox").toggleClass("shiftZIndex");
      }
      $(".cardBox").removeClass("shiftZIndexBack");
      if ($(".boxOfme").hasClass("forOpen")) {
        $(".boxOfme").removeClass("forOpen");
      }
      if ($(".boxOfme").hasClass("forClose")) {
        $(".boxOfme").removeClass("forClose");
      }
    }

    if (window.innerWidth < 658) {
      $(".boxOfme").addClass("forClose");
      $(".cardBox").removeClass("shiftZIndex");
      if (!$(".menu").hasClass("open")) {
        $(".cardBox").addClass("shiftZIndexBack");
      } else {
        $(".cardBox").removeClass("shiftZIndexBack");
      }
    }
  });
  // ............................................................
  // ....................................bottom parallax......................
  let wave1 = document.getElementById("wave-1");
  let wave2 = document.getElementById("wave-2");
  let wave3 = document.getElementById("wave-3");
  let wave4 = document.getElementById("wave-4");

  window.addEventListener("scroll", function () {
    let value = window.scrollY;
    wave1.style.backgroundPositionX = 400 + value * 4 + "px";
    wave2.style.backgroundPositionX = 300 + value * -4 + "px";
    wave3.style.backgroundPositionX = 200 + value * 2 + "px";
    wave4.style.backgroundPositionX = 100 + value * -2 + "px";
  });

  // ..........................................................
  gsap.to("#bg", {
    scrollTrigger: {
      scrub: 1,
    },
    scale: 2,
  });
  gsap.to("#man", {
    scrollTrigger: {
      scrub: 1,
    },
    scale: 0.1,
  });
  gsap.to("#mountain_left", {
    scrollTrigger: {
      scrub: 1,
    },
    x: -1000,
  });
  gsap.to("#mountain_right", {
    scrollTrigger: {
      scrub: 1,
    },
    x: 1000,
  });
  gsap.to("#clouds_1", {
    scrollTrigger: {
      scrub: 1,
    },
    x: -600,
  });
  gsap.to("#clouds_2", {
    scrollTrigger: {
      scrub: 1,
    },
    x: 600,
  });
  gsap.to("#text", {
    scrollTrigger: {
      scrub: 1,
    },
    y: 1000,
  });

  // ................................navbar...................
  selector(".menu").addEventListener("click", function () {
    this.classList.toggle("open");
    selector("header").classList.toggle("open");
    selector(".overlay").classList.toggle("open");
    if (!$(".menu").hasClass("open")) {
      $(".cardBox").addClass("shiftZIndexBack");
    } else {
      $(".cardBox").removeClass("shiftZIndexBack");
    }
    if (selector("header").classList.contains("open")) {
      // $(".boxOfme").css("z-index", "999");
      $(".boxOfme").addClass("forOpen");
      $(".boxOfme").removeClass("forClose");
    } else {
      // $(".boxOfme").css("z-index", "1000");
      $(".boxOfme").addClass("forClose");
      $(".boxOfme").removeClass("forOpen");
    }
  });
  function selector(s) {
    return document.querySelector(s);
  }

  let counterForReportsSelected = 0;
  const closeBtnForPopUp = $(".close-btn");
  // .....................search Engine..................................
  const icon2 = $(".iconForSearchBar");
  const search2 = document.querySelector(".searchNumberTwo");
  icon2.click(function () {
    search2.classList.toggle("active");
    if (!$(search2).hasClass("active")) {
      $("#mySearch")[0].value = "";

      for (let i = 0; i < 50; i++) {
        let data = $("#contentDiv")[0].children[i];
        $(data).removeClass("makeTheCardsDissapear");
      }
      if (localStorage.getItem("isatkeypressed")) {
        localStorage.removeItem("isatkeypressed");
      }
    }
    // console.log("clicked on!");
  });
  $(".searching").click(() => {
    console.log("Arrived!");
  });
  clearDataFromSearchBox();
  function clearDataFromSearchBox() {
    $(".clearclear").click(function () {
      for (let i = 0; i < 50; i++) {
        let data = $("#contentDiv")[0].children[i];
        $(data).removeClass("makeTheCardsDissapear");
      }
      if (localStorage.getItem("isatkeypressed")) {
        localStorage.removeItem("isatkeypressed");
      }
    });
  }

  // ....................Reports Graph...................................
  $(".reportsLink").click(handleReports);
  function handleReports() {
    function removeDuplicates(arr) {
      return arr.filter((item, index) => arr.indexOf(item) === index);
    }

    let selectedCoins = JSON.parse(
      localStorage.getItem("arrayOfObjectsSelected")
    );

    if (localStorage.getItem("arrayOfObjectsSelected")) {
      if (selectedCoins.length > 0) {
        $(".boxOfme").css("display", "none");
        $("#chartContainer").css("visibility", "visible");
        $("#contentDiv").css("display", "none");

        let arrayOfSelectedCoinsNamesTwo = [];

        for (let i = 0; i < selectedCoins.length; i++) {
          arrayOfSelectedCoinsNamesTwo[i] = selectedCoins[i].key.toUpperCase();
        }
        arrayOfSelectedCoinsNames = removeDuplicates(
          arrayOfSelectedCoinsNamesTwo
        );

        $(".reportsLink").click(handleReports);

        // .......................................................
        let allDataPoints = [[], [], [], [], []];

        let options = {
          title: {
            text: "Crypto Live",
          },
          axisX: {
            title: "chart updates every 2 secs",
          },
          axisY: {
            suffix: "USD",
          },
          toolTip: {
            shared: true,
          },
          legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries,
          },
          data: objectForGraph(),
        };

        let chart = $("#chartContainer").CanvasJSChart(options);

        function toggleDataSeries(e) {
          if (
            typeof e.dataSeries.visible === "undefined" ||
            e.dataSeries.visible
          ) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }

        let updateInterval = 2000;
        // initial value
        let yValue1 = 800;
        let yValue2 = 810;
        let yValue3 = 780;
        let yValue4 = 770;
        let yValue5 = 760;
        let time = new Date();
        // starting at 10.00 am
        time.setHours(time.getHours());
        time.setMinutes(time.getMinutes());
        time.setSeconds(time.getSeconds());
        time.setMilliseconds(time.getMilliseconds());

        async function addingData(currency) {
          let dataToReturn = [];
          let dataOdNamesToReturn = [];
          $.ajax({
            type: "GET",
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${currency}&tsyms=USD&api_key=2750a90166e22d13f3133839f6e2a05913ca643fa648b6b508033b39dac237f2`,
            success: function (results) {
              for (const [key, value] of Object.entries(results)) {
                dataToReturn.push(value.USD);
                dataOdNamesToReturn.push(key);
              }

              updateChart(100, dataToReturn, arrayOfSelectedCoinsNames);
              // console.log(dataOdNamesToReturn);
            },
          });
        }

        function updateChart(count, returnedData, dataOdNamesToReturn) {
          try {
            // console.log(returnedData);
            count = count || 1;
            let deltaY1, deltaY2, deltaY3, deltaY4, deltaY5;
            for (let i = 0; i < count; i++) {
              time.setTime(time.getTime() + 2000);
              deltaY1 = -1 + Math.random() * (1 + 1);
              deltaY2 = -1 + Math.random() * (1 + 1);
              deltaY3 = -1 + Math.random() * (1 + 1);
              deltaY4 = -1 + Math.random() * (1 + 1);
              deltaY5 = -1 + Math.random() * (1 + 1);

              // adding random value and rounding it to two digits.
              yValue1 = returnedData[0];
              yValue2 = returnedData[1];
              yValue3 = returnedData[2];
              yValue4 = returnedData[3];
              yValue5 = returnedData[4];

              // pushing the new values
              allDataPoints[0].push({
                x: time.getTime(),
                y: yValue1,
              });
              allDataPoints[1].push({
                x: time.getTime(),
                y: yValue2,
              });
              allDataPoints[2].push({
                x: time.getTime(),
                y: yValue3,
              });
              allDataPoints[3].push({
                x: time.getTime(),
                y: yValue4,
              });
              allDataPoints[4].push({
                x: time.getTime(),
                y: yValue5,
              });
            }

            // updating legend text with  updated with y Value

            for (let i = 0; i < dataOdNamesToReturn.length; i++) {
              options.data[i].legendText =
                dataOdNamesToReturn[i] + ": " + returnedData[i] + "USD";
            }
            $("#chartContainer").CanvasJSChart().render();
          } catch (err) {}
        }
        // generates first set of dataPoints

        setInterval(function () {
          addingData(arrayOfSelectedCoinsNames);
        }, updateInterval);

        function objectForGraph() {
          let html = [];
          for (let i = 0; i < arrayOfSelectedCoinsNames.length; i++) {
            html.push({
              type: "line",
              xValueType: "dateTime",
              yValueFormatString: "###.00USD",
              showInLegend: true,
              name: arrayOfSelectedCoinsNames[i],
              dataPoints: allDataPoints[i],
            });
          }
          html.join("");
          return html;
        }
      }
    }
  }

  // .......................................................
  const contentDiv = $("#contentDiv");
  const container = document.querySelector(".container");

  $(".currenciesLink").click(handleCurrencies);

  const navToggle = $(".nav-toggle");

  navToggle.click(function () {
    container.classList.toggle("show-links");
  });
  // ................About Me..................
  $(".aboutLink").click(handleAbout);
  function handleAbout() {
    $(".boxOfme").css("display", "inline");
  }

  // ........................................
  // ........................Fetching Data..............................................
  async function handleCurrencies() {
    $(".boxOfme").css("display", "none");
    $("#chartContainer").css("visibility", "hidden");
    $("#contentDiv").css("display", "inline-flex");
    if (!localStorage.getItem("isRefreshed")) {
      $(".preLoaderForFirstCallToAJAX").show();
      const coins = await getJson("https://api.coingecko.com/api/v3/coins/");

      for (let i = 0; i < coins.length; i++) {
        arrayOfObjectsFromDataBaseTwo.set(`${coins[i].symbol}`, {
          clicked: false,
          index: i,
          symbol: coins[i].symbol,
        });
      }
      displayCoins(coins);
      $(".preLoaderForFirstCallToAJAX").hide();
      // down here i am updating the local storage for "arrayOfObjectsFromDataBaseTwo"
      for (let i = 0; i < coins.length; i++) {
        localStorageArrayOfObjectsFromDataBaseTwo[i] = {
          key: coins[i].symbol,
          clicked: false,
          index: i,
          symbol: coins[i].symbol,
        };
      }

      localStorage.setItem(
        "arrayOfObjectsFromDataBaseTwo",
        JSON.stringify(localStorageArrayOfObjectsFromDataBaseTwo)
      );

      localStorage.setItem("isRefreshed", true);
    } else {
      updateValuesAfterRefresh();
      afterRefresh();
    }
  }

  async function getJson(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }

  async function displayCoins(coins) {
    let html = "";
    for (const coin of coins) {
      html += `
                <div class="cardBox shiftZIndex " data-tilt>
                <img src="${coin.image.thumb}" class="imgicon">
                <div class="checkbox">
                <input type="checkbox" class="checkbox-input" />
                 <label for="checkbox-input">
                <div class="checkbox-icons"></div>
              </label>

               </div>

                <div class="border-design">

                <span class="upperCaseForSymbol">${coin.symbol}</span>

            <span>    ${coin.name} </span>

                <br>
                <button class="btn btn-success m-2 pointer" type="button" data-bs-toggle="collapse" data-bs-target="#${coin.id} ">
                More Info
              </button>

              <div class="collapse  w-100" id="${coin.id}">
                <div class="card-body w-50  w-75 text-center m-auto spinnerHere">
                <div class="preLoader"></div>
                    <table class="table table-dark table-hover table-striped-columns rounded rounded-4 overflow-hidden ">
                      <thead >
                        <tr>
                          <th>COUNTRY</th>
                          <th>VALUE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Israel</td>
                          <td> ${coin.market_data.current_price.ils} ₪</td>
                        </tr>
                        <tr>
                        <td>United States</td>
                        <td>${coin.market_data.current_price.usd}$</td>
                        </tr>
                        <tr>
                        <td>Europe</td>
                        <td>${coin.market_data.current_price.eur}€</td>
                        </tr>

                      </tbody>
                    </table>

                    </div>

              </div>

                </div>
                </div>

            `;
    }

    // ...................................................................
    // ...........local data of cards................

    localStorageAllDataOfCards = html;
    localStorage.setItem(
      "localStorageAllDataOfCards",
      JSON.stringify(localStorageAllDataOfCards)
    );

    contentDiv.html(html);
    // down here is to fix parallax effect dynamically
    $(".wrapper-parallax").css({
      height: "fit-content",
      width: "fit-content",
    });
    // .........................................................
    // .....................The crazy design issue for display flex....................................

    dataForTableDropdDownEvent();
    checkboxClickEvent();
    // ..........................checkbox clicker.................................
  }

  function dataForTableDropdDownEvent() {
    const btnPointer = $(".pointer");
    btnPointer.on("click", function () {
      // .....................Card Display Organizer............................
      let is = false;
      // this help me with making the catch have no multiplyes
      let push = true;
      // .....................
      $(this)
        .parent()
        .parent()
        .parent()
        .children()
        .each(function () {
          // .............down here is the card that is open / or the same card open and then closed / or a different card opened and the previous card closed and that is the card that will be returned...................

          $(this).css("height", "200px");
          $(this).collapse("hide");
          $(this)
            .children(".border-design")
            .children(".collapse")
            .collapse("hide");
        });
      $(this).next().css("visibility", "visible");
      $(this).parent().parent().css("height", "auto");
      // .................................................
      $(".preLoader").show();
      let idCoin = $(this).next().attr("id");
      let timeNow = Date.now();
      let backUpCoin = JSON.parse(localStorage.getItem(idCoin));

      let temp = $(`#${idCoin}`);

      if (backUpCoin != null && timeNow - backUpCoin.time < 120000) {
        console.log("from local");
        $(".preLoader").hide();
        let html = `
        <table class="table table-dark table-hover table-striped-columns rounded rounded-4 overflow-hidden ">
        <thead >
          <tr>
            <th>COUNTRY</th>
            <th>VALUE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Israel</td>
            <td> ${backUpCoin.market_data.current_price.ils.toFixed(4)} ₪</td>
          </tr>
          <tr>
          <td>United States</td>
          <td>${backUpCoin.market_data.current_price.usd.toFixed(4)}$</td>
          </tr>
          <tr>
          <td>Europe</td>
          <td>${backUpCoin.market_data.current_price.eur.toFixed(4)}€</td>
          </tr>
    
        </tbody>
      </table>
         `;
        $(temp[0].lastElementChild.lastElementChild).html(html);
      } else {
        console.log("from Ajax");
        setTimeout(function () {
          $.ajax({
            type: "GET",
            url: `https://api.coingecko.com/api/v3/coins/${idCoin}`,
            beforeSend: function () {
              $(".preLoader").show();
            },
            success: function (results) {
              $(".preLoader").hide();

              let html = `
      <table class="table table-dark table-hover table-striped-columns rounded rounded-4 overflow-hidden ">
      <thead >
        <tr>
          <th>COUNTRY</th>
          <th>VALUE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Israel</td>
          <td> ${results.market_data.current_price.ils.toFixed(4)} ₪</td>
        </tr>
        <tr>
        <td>United States</td>
        <td>${results.market_data.current_price.usd.toFixed(4)}$</td>
        </tr>
        <tr>
        <td>Europe</td>
        <td>${results.market_data.current_price.eur.toFixed(4)}€</td>
        </tr>
  
      </tbody>
    </table>
       `;
              $(temp[0].lastElementChild.lastElementChild).html(html);
              results.time = Date.now();
              localStorage.setItem(`${results.id}`, JSON.stringify(results));
            },
          });
        }, 3000);
      }
    });
  }
  function checkboxClickEvent() {
    $(".checkbox-input").click(function () {
      // down here is to keep count of number of coins that have been checked

      try {
        if (arrayOfObjectsSelected.size === 5 && $(this)[0].checked === true) {
          //  im stopping here the click of a 6th element that is not allowed
          $(this)[0].checked = false;
          // disable all elements behind the credit card dialog
          $(".checkbox").addClass("disableInputBox");
          $("button").css("pointer-events", "none");
          $(".searchNumberTwo").addClass("disableInputBox");
          $("nav").addClass("disableInputBox");
          $(".menu").addClass("disableInputBox");
          $(".boxOfme").css("display", "none");
          popUpActivated($(this)[0]);
        } else {
          const idOfCheckedCard = $(this)
            .parent()
            .parent()[0]
            .children[2].children[0].innerText.toLowerCase();

          if (
            arrayOfObjectsFromDataBaseTwo.get(`${idOfCheckedCard}`).clicked ===
            true
          ) {
            counterForReportsSelected--;
            arrayOfObjectsFromDataBaseTwo.set(`${idOfCheckedCard}`, {
              clicked: false,
              index: arrayOfObjectsFromDataBaseTwo.get(`${idOfCheckedCard}`)
                .index,
              symbol: arrayOfObjectsFromDataBaseTwo.get(`${idOfCheckedCard}`)
                .symbol,
            });
            arrayOfObjectsSelected.delete(`${idOfCheckedCard}`);
            // ....................local storage.............................
            let iteratorOne = arrayOfObjectsFromDataBaseTwo.entries();
            for (let i = 0; i < arrayOfObjectsFromDataBaseTwo.size; i++) {
              let tempDataOfObject = iteratorOne.next().value;
              localStorageArrayOfObjectsFromDataBaseTwo[i] = {
                key: tempDataOfObject[0],
                clicked: tempDataOfObject[1].clicked,
                index: tempDataOfObject[1].index,
                symbol: tempDataOfObject[1].symbol,
              };
            }
            localStorage.setItem(
              "arrayOfObjectsFromDataBaseTwo",
              JSON.stringify(localStorageArrayOfObjectsFromDataBaseTwo)
            );
            // ...................update selected object locals storage..................

            let iteratorSelectedOne = arrayOfObjectsSelected.entries();
            for (let i = 0; i < arrayOfObjectsSelected.size; i++) {
              let tempDataOfObject = iteratorSelectedOne.next().value;
              localStorageArrayOfObjectsSelected[i] = {
                key: tempDataOfObject[0],
                clicked: tempDataOfObject[1].clicked,
                index: tempDataOfObject[1].index,
                symbol: tempDataOfObject[1].symbol,
              };
            }
            localStorage.removeItem("arrayOfObjectsSelected");

            localStorage.setItem(
              "arrayOfObjectsSelected",
              JSON.stringify(localStorageArrayOfObjectsSelected)
            );
            localStorageArrayOfObjectsSelected = [];
          } else {
            counterForReportsSelected++;

            arrayOfObjectsFromDataBaseTwo.set(`${idOfCheckedCard}`, {
              clicked: true,
              index: arrayOfObjectsFromDataBaseTwo.get(`${idOfCheckedCard}`)
                .index,
              symbol: arrayOfObjectsFromDataBaseTwo.get(`${idOfCheckedCard}`)
                .symbol,
            });
            arrayOfObjectsSelected.set(`${idOfCheckedCard}`, {
              clicked: true,
              index: arrayOfObjectsFromDataBaseTwo.get(`${idOfCheckedCard}`)
                .index,
              symbol: arrayOfObjectsFromDataBaseTwo.get(`${idOfCheckedCard}`)
                .symbol,
            });
            // ....................local storage.............................
            let iteratorTwo = arrayOfObjectsFromDataBaseTwo.entries();
            for (let i = 0; i < arrayOfObjectsFromDataBaseTwo.size; i++) {
              let tempDataOfObject = iteratorTwo.next().value;
              localStorageArrayOfObjectsFromDataBaseTwo[i] = {
                key: tempDataOfObject[0],
                clicked: tempDataOfObject[1].clicked,
                index: tempDataOfObject[1].index,
                symbol: tempDataOfObject[1].symbol,
              };
            }
            localStorage.setItem(
              "arrayOfObjectsFromDataBaseTwo",
              JSON.stringify(localStorageArrayOfObjectsFromDataBaseTwo)
            );
            // ...................update selected object locals storage..................
            let iteratorSelectedTwo = arrayOfObjectsSelected.entries();
            for (let i = 0; i < arrayOfObjectsSelected.size; i++) {
              let tempDataOfObject = iteratorSelectedTwo.next().value;
              localStorageArrayOfObjectsSelected[i] = {
                key: tempDataOfObject[0],
                clicked: tempDataOfObject[1].clicked,
                index: tempDataOfObject[1].index,
                symbol: tempDataOfObject[1].symbol,
              };
            }
            localStorage.setItem(
              "arrayOfObjectsSelected",
              JSON.stringify(localStorageArrayOfObjectsSelected)
            );
            localStorageArrayOfObjectsSelected = [];
          }
        }
      } catch (err) {}
    });
  }

  function popUpActivated(sixthElementClickedOn) {
    let theNeedToReturnToAllCards = false;
    let isInside = false;
    // ....................keysixthelement............

    // .........................six element.......................
    try {
      const keyOfSixthElement = $(sixthElementClickedOn)
        .parent()
        .parent()[0]
        .children[2].children[0].innerText.toLowerCase();
      // .........................................
      $(closeBtnForPopUp).css("visibility", "visible");
      $(closeBtnForPopUp).click(() => {
        isInside = true;
        $(closeBtnForPopUp).css("visibility", "hidden");
        $(".credit-card").removeClass("open-modal");
        $(".checkbox").removeClass("disableInputBox");
        $(".searchNumberTwo").removeClass("disableInputBox");
        $("nav").removeClass("disableInputBox");
        $(".menu").removeClass("disableInputBox");
        $("button").css("pointer-events", "auto");
      });
      const arrayOfNamesOfObjectsSelected = [];
      // making the popup visible
      $(".credit-card").addClass("open-modal");

      arrayOfObjectsSelected.forEach((e) => {
        arrayOfNamesOfObjectsSelected.push(e);
      });

      for (let i = 0; i < arrayOfNamesOfObjectsSelected.length; i++) {
        $(".credit-card").children().children()[1].children[
          i
        ].children[0].innerText = arrayOfNamesOfObjectsSelected[i].symbol;
        // here i remove the disable class to the selected currency
        $(".credit-card")
          .children()
          .children()[1]
          .children[i].children[1].classList.remove("disableInputBox");
        // down here im giving each popup checkbox a click event
        $(".credit-card")
          .children()
          .children()[1]
          .children[i].addEventListener("click", function () {
            // setTimeout(() => {
            let idOfCardToToggleBackX = this.children[0].innerHTML;
            // console.log(idOfCardToToggleBackX);
            for (let i = 0; i < 49 && !isInside; i++) {
              let nameOfCardToDelete = "";
              if (localStorage.getItem("isatkeypressed")) {
                nameOfCardToDelete =
                  $("#contentDiv")[0].children[i].children[2].children[0]
                    .innerHTML;
              } else {
                nameOfCardToDelete =
                  $("#contentDiv")[0].children[i].children[2].children[0]
                    .innerText;
              }

              if (
                nameOfCardToDelete.toLowerCase() === idOfCardToToggleBackX &&
                !isInside
              ) {
                isInside = true;

                counterForReportsSelected--;
                let theOneDoDelete =
                  $("#contentDiv")[0].children[i].children[1].children[0];

                theOneDoDelete.checked = false;
                let idToBeUpdated = "";
                if (localStorage.getItem("isatkeypressed")) {
                  idToBeUpdated =
                    $("#contentDiv")[0].children[i].children[2].children[0]
                      .innerHTML;
                  theNeedToReturnToAllCards = true;
                  localStorage.removeItem("isatkeypressed");
                } else {
                  idToBeUpdated =
                    $("#contentDiv")[0].children[
                      i
                    ].children[2].children[0].innerText.toLowerCase();
                }

                arrayOfObjectsSelected.delete(`${idToBeUpdated}`);
                arrayOfObjectsFromDataBaseTwo.set(`${idToBeUpdated}`, {
                  clicked: false,
                  index: arrayOfObjectsFromDataBaseTwo.get(`${idToBeUpdated}`)
                    .index,
                  symbol: arrayOfObjectsFromDataBaseTwo.get(`${idToBeUpdated}`)
                    .symbol,
                });

                // ..............key six element.................
                arrayOfObjectsFromDataBaseTwo.set(`${keyOfSixthElement}`, {
                  clicked: true,
                  index: arrayOfObjectsFromDataBaseTwo.get(
                    `${keyOfSixthElement}`
                  ).index,
                  symbol: arrayOfObjectsFromDataBaseTwo.get(
                    `${keyOfSixthElement}`
                  ).symbol,
                });
                arrayOfObjectsSelected.set(`${keyOfSixthElement}`, {
                  clicked: true,
                  index: arrayOfObjectsFromDataBaseTwo.get(
                    `${keyOfSixthElement}`
                  ).index,
                  symbol: arrayOfObjectsFromDataBaseTwo.get(
                    `${keyOfSixthElement}`
                  ).symbol,
                });

                sixthElementClickedOn.checked = true;
                // .....................update local storage..................
                let iteratorOne = arrayOfObjectsFromDataBaseTwo.entries();
                for (let i = 0; i < arrayOfObjectsFromDataBaseTwo.size; i++) {
                  let tempDataOfObject = iteratorOne.next().value;
                  localStorageArrayOfObjectsFromDataBaseTwo[i] = {
                    key: tempDataOfObject[0],
                    clicked: tempDataOfObject[1].clicked,
                    index: tempDataOfObject[1].index,
                    symbol: tempDataOfObject[1].symbol,
                  };
                }
                localStorage.setItem(
                  "arrayOfObjectsFromDataBaseTwo",
                  JSON.stringify(localStorageArrayOfObjectsFromDataBaseTwo)
                );

                // ...................update selected object locals storage..................

                let iteratorSelectedOne = arrayOfObjectsSelected.entries();
                for (let i = 0; i < arrayOfObjectsSelected.size; i++) {
                  let tempDataOfObject = iteratorSelectedOne.next().value;
                  localStorageArrayOfObjectsSelected[i] = {
                    key: tempDataOfObject[0],
                    clicked: tempDataOfObject[1].clicked,
                    index: tempDataOfObject[1].index,
                    symbol: tempDataOfObject[1].symbol,
                  };
                }
                localStorage.removeItem("arrayOfObjectsSelected");

                localStorage.setItem(
                  "arrayOfObjectsSelected",
                  JSON.stringify(localStorageArrayOfObjectsSelected)
                );
                localStorageArrayOfObjectsSelected = [];
              }
            }
            if (theNeedToReturnToAllCards) {
              for (let i = 0; i < 50; i++) {
                let data = $("#contentDiv")[0].children[i];
                $(data).removeClass("makeTheCardsDissapear");
              }
              if (localStorage.getItem("isatkeypressed")) {
                localStorage.removeItem("isatkeypressed");
              }
              $("#mySearch")[0].value = "";
              const search2 = document.querySelector(".searchNumberTwo");
              search2.classList.toggle("active");
              theNeedToReturnToAllCards = false;
            }
            counterForReportsSelected--;
            $(closeBtnForPopUp).css("visibility", "hidden");
            $(".credit-card").removeClass("open-modal");
            $(".checkbox").removeClass("disableInputBox");
            $(".searchNumberTwo").removeClass("disableInputBox");
            $("nav").removeClass("disableInputBox");
            $(".menu").removeClass("disableInputBox");
            $("button").css("pointer-events", "auto");
            // }, 1000);
          });
      }
    } catch (err) {}
  }
});

// .........................................................
