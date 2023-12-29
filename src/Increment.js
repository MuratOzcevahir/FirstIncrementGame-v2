import "./increment.css";
import React, { useEffect, useReducer, useState } from 'react'
import soundError from "./sounds/error-1.wav";
import soundWood from "./sounds/wood-chop-1.wav";
import soundWood2 from "./sounds/wood-chop-2.wav";
import soundWood3 from "./sounds/wood-chop-3.wav";
import soundFood1 from "./sounds/food-collect-1.wav"
import soundSellItem from "./sounds/sell-item-1.wav"
import soundBuyItem from "./sounds/buy-item-1.wav"
import soundUpgradeItem from "./sounds/upgrade-item.wav"
import soundWorkerBuyError from "./sounds/worker-buy-error-1.wav"
import Detail from "./components/Detail";
import axios from "axios";
import Icon from "./components/icons/Icon";
import ItemBuy from "./components/ItemBuy";
import ItemUpgrade from "./components/ItemUpgrade";
import ItemInformation from "./components/ItemInformation";

var woodAmount = 0;
var foodAmount = 0;
var chopAmount = 1;
var isStorageFull = { wood: false, food: false };
var totalMinus = 0;
var remainingSecForFullStorage = 0;
var data = {
     wood: 0,
     woodCutter: 0,
     coin: 0,
     storage: 0
}
function WoodAudioPlay() {

     var rnd = Math.round(Math.random() * 2)
     if (rnd === 0) {
          new Audio(soundWood).play();
     }
     else if (rnd === 1) {
          new Audio(soundWood2).play();
     }
     else if (rnd === 2) {
          new Audio(soundWood3).play();
     }
}
function Increment() {

     //profile variables start
     const [profileStats, setprofileStats] = useState({ Level: 1, ExperianceTo: 200, Experiance: 0 })

     //profile variables end
     //coin variables start
     var [coin, setcoin] = useState(0)
     var [coinPower, setcoinPower] = useState(1)
     const [coinLevel, setcoinLevel] = useState(0)
     const [coinUpdatePrice, setcoinUpdatePrice] = useState(0)
     var [isAutoSellActive, setisAutoSellActive] = useState(false)
     //coin variables end
     //humanity variables start

     var [humanityVariables, sethumanityVariables] = useState({ House: 1, Population: 0, FoodReduce: 0 })
     //humanity variables end

     //#region WOOD
     const [chopPower, setchopPower] = useState(0.1)
     const [chopLevel, setchopLevel] = useState(0)
     var [chopUpdatePrice, setchopUpdatePrice] = useState(0)
     //-----------------------------
     const [woodCutter, setwoodCutter] = useState(0)
     const [woodCutterPower, setwoodCutterPower] = useState(0.01)
     const [woodCutterLevel, setwoodCutterLevel] = useState(0)
     const [woodcutterUpdatePrice, setwoodcutterUpdatePrice] = useState(0)
     var [woodcuttersCanWork, setwoodcuttersCanWork] = useState(false)

     const [woodcutterPrice, setwoodcutterPrice] = useState({ coin: 10, wood: 20, food: 30 })
     //#endregion WOOD

     //resource variables start
     var [resourceWood, setResourceWood] = useState(0);
     const [resourceWoodStorage, setResourceWoodStorage] = useState(100);
     const [storagePercentCalculate, setstoragePercentCalculate] = useState(0);
     const [storageRemainingTime, setstorageRemainingTime] = useState(0);

     const [storagePrice, setstoragePrice] = useState({ coin: 10, wood: 100 });

     var [resourceFoood, setresourceFoood] = useState(100);
     var [resourceFoodStorage, setresourceFoodStorage] = useState(100)
     const [foodPower, setfoodPower] = useState(0.1)
     const [foodLevel, setfoodLevel] = useState(0)
     const [foodUpdatePrice, setfoodUpdatePrice] = useState(0)

     //resource variables end

     useEffect(() => {
          axios
               .get("http://localhost:6969/GameData/")
               .then((response) => {
                    setResourceWood(response.data.User.UserGameData.GeneralGameData.wood);
                    setcoin(response.data.User.UserGameData.GeneralGameData.coin)
                    setwoodCutter(response.data.User.UserGameData.GeneralGameData.woodCutter)
                    setResourceWoodStorage(response.data.User.UserGameData.GeneralGameData.storage)
                    setisAutoSellActive(response.data.User.UserGameData.GeneralGameSetting.IsAutoSell)
                    woodAmount = response.data.User.UserGameData.GeneralGameData.wood
               })
               .catch()

          // var savedData = localStorage.getItem("dataTest")


          // console.log(storagePrice)
          // data = JSON.parse(savedData);

          // if (data === null || data === undefined || data === "") {
          //      SaveGame();
          // }
          // console.log(savedData);
          // console.log(data);
          // setwoodCutter(data.woodCutter);
          // woodAmount = data.wood;
          // setResourceWoodStorage(100);
          // console.log("data wood " + data.wood)
          // console.log("data coin " + data.coin)

     }, [])

     function SaveGame() {
          data = {
               wood: woodAmount,
               coin: coin,
               woodCutter: woodCutter,
               storage: resourceWoodStorage
          }
          console.log(woodAmount);
          var userGameSave = {
               User: {

                    UserGeneral: { id: 1, name: "murat", surname: "etc" },
                    UserGameData: {
                         GeneralGameData:
                         {
                              wood: woodAmount,
                              coin: coin,
                              woodCutter: woodCutter,
                              storage: resourceWoodStorage
                         },
                         GeneralGameSetting:
                         {
                              IsAutoSell: isAutoSellActive,
                              coin: coin,
                              woodCutter: woodCutter,
                              storage: resourceWoodStorage
                         }
                    }
               }
          }
          axios
               .post("http://localhost:6969/GameData", userGameSave)
               .then((response) => {

               })
               .catch((err) => { console.log("hat aldın" + err) });


          // localStorage.setItem("dataTest", JSON.stringify(data));
     }

     function AudioErrPlay() {
          new Audio(soundError).play();
     }
     function SoundUpgradeItem() {
          new Audio(soundUpgradeItem).play();

     }
     function StoragePercentCalculate() {
          if (storagePercentCalculate > 100)
               setstoragePercentCalculate(100);
          else {
               setstoragePercentCalculate(((woodAmount * 100) / resourceWoodStorage));
          }
     }
     function ProfileLevelControl() {
          if (profileStats.Experiance >= profileStats.ExperianceTo) {
               profileStats.Experiance = 0
               profileStats.Level++;
               profileStats.ExperianceTo *= profileStats.Level
          }
     }
     useEffect(() => {
          totalMinus = (woodCutter * woodCutterPower)
          remainingSecForFullStorage = (resourceWoodStorage - woodAmount) / (totalMinus);
          var resourceWoodTimer = setInterval(() => {
               if (isStorageFull.wood === true) {
                    setstoragePercentCalculate(100);

               }
               else if (woodcuttersCanWork === true && woodCutter > 0) {
                    woodAmount += (woodCutter * woodCutterPower);

                    profileStats.Experiance += 0.01;
                    ProfileLevelControl()
                    setstoragePercentCalculate(((woodAmount * 100) / resourceWoodStorage));
                    StorageControl();
                    //woodocutter gaining wood
                    remainingSecForFullStorage--;
                    if (remainingSecForFullStorage <= 0) {
                         remainingSecForFullStorage = 0;
                    }
                    setstorageRemainingTime(remainingSecForFullStorage);

                    console.log("food miktarı " + foodAmount)


                    if (foodAmount > 0) {
                         foodAmount -= (humanityVariables.FoodReduce);
                         console.log("can work? büyükse " + woodcuttersCanWork)
                         woodcuttersCanWork = true
                    }
                    else if (foodAmount <= 0 && woodCutter > 0) {
                         woodcuttersCanWork = false
                         foodAmount = 0;
                         document.getElementById("text_error").innerText = "No more food for woodcutters. They won't work anymore";

                    }

               }
               document.getElementById("text_priceB").innerText = foodAmount.toFixed(2);

          }, 1000);
          return () => {
               clearInterval(resourceWoodTimer);
          }
     }, [woodCutter, resourceWoodStorage, woodCutterPower, foodAmount])
     useEffect(() => {
          var autosell = setInterval(() => {
               if (woodAmount > 1 && isAutoSellActive === true) {
                    SellWood(100);
               }
               else {
               }
          }, 2000);
          return () => {
               clearInterval(autosell)
          }
     }, [coin, isAutoSellActive])
     function SetAutoSellActiveDeactive() {

          if (isAutoSellActive === false) {
               setisAutoSellActive(true);
          }
          else {
               setisAutoSellActive(false);
          }
     }
     function StorageControl() {
          if (woodAmount < resourceWoodStorage) {
               isStorageFull.wood = false;
               setResourceWood(woodAmount);
               document.getElementById("text_priceA").innerText = woodAmount.toFixed(2);
          }
          else {
               isStorageFull.wood = true;
               woodAmount = resourceWoodStorage;
               document.getElementById("text_priceA").innerText = woodAmount.toFixed(2)
               document.getElementById("text_error").innerText = "Wood storage is full";
          }
          if (foodAmount < resourceFoodStorage) {
               isStorageFull.food = false
               document.getElementById("text_priceB").innerText = foodAmount.toFixed(2)
               setresourceFoood(foodAmount)
          } else {
               isStorageFull.food = true;

               foodAmount = resourceFoodStorage;
               document.getElementById("text_priceB").innerText = foodAmount.toFixed(2)
               document.getElementById("text_error").append(" -Food storage is full");
          }
     }
     function FoodCollect() {
          // foodAmount += 1;
          if (isStorageFull.food === false) {
               profileStats.Experiance += 25;
               ProfileLevelControl()
               setwoodcuttersCanWork(true);
               new Audio(soundFood1).play();
               foodAmount += (foodPower * 100);
               StorageControl();
          }
          else {
               setresourceFoood(foodAmount)
               AudioErrPlay();
          }
     }
     function WoodCollect() {
          if (isStorageFull.wood === false) {
               profileStats.Experiance += 15;
               ProfileLevelControl()
               WoodAudioPlay();
               woodAmount += ((chopAmount * chopPower) * 100);
               StoragePercentCalculate();
               StorageControl();
               document.getElementById("text_priceA").innerText = woodAmount.toFixed(2);
          }
          else {
               AudioErrPlay();
          }
     }
     function BuyStorage() {
          var w = storagePrice.wood;
          var c = storagePrice.coin;
          document.getElementById("text_error").innerText = "";
          if ((woodAmount >= storagePrice.wood) && coin >= storagePrice.coin) {
               new Audio(soundBuyItem).play();
               woodAmount -= storagePrice.wood;
               setcoin(coin -= storagePrice.coin)
               storagePrice.wood = w * 2
               storagePrice.coin = c * 5
               // setstoragePrice({ coin: (c * 2), wood: (w * 1.9) })
               StoragePercentCalculate()
               StorageControl();
               setResourceWoodStorage(resourceWoodStorage * 2);
          }
          else {
               AudioErrPlay();
          }
          console.log("wood " + w + " coin " + c)
     }
     function BuyWoodcutter() {
          var f = woodcutterPrice.food;
          var c = woodcutterPrice.coin;
          var w = woodcutterPrice.wood;
          if ((woodAmount >= w) && (foodAmount >= f) && (coin >= c) && (humanityVariables.Population < humanityVariables.House)) {
               new Audio(soundBuyItem).play();
               woodAmount -= w;
               setcoin(coin -= c);
               foodAmount -= f;

               setwoodCutter(woodCutter + 1);
               humanityVariables.Population++;
               humanityVariables.FoodReduce += 0.03;
               woodcutterPrice.food = (f * 2);
               woodcutterPrice.wood = (w * 2)
               woodcutterPrice.coin = (c * 3)
               setwoodcuttersCanWork(true)
               StorageControl();
               console.log("wood power " + woodCutterPower)
          }
          else {
               if (humanityVariables.Population >= humanityVariables.House) {
                    document.getElementById("text_error").append("Not enough house for more human");
               }
               AudioErrPlay();
          }
     }
     function UpgradeChop() {
          if (coin >= chopUpdatePrice) {
               setcoin(coin -= chopUpdatePrice)
               new Audio(soundUpgradeItem).play();
               setchopLevel(chopLevel + 1);
               setchopPower(chopPower + 0.1);
          }
          else {
               AudioErrPlay();
          }
     }
     function UpgradeFood() {
          if (coin >= foodUpdatePrice) {
               new Audio(soundUpgradeItem).play();
               setcoin(coin -= foodUpdatePrice)
               setfoodLevel(foodLevel + 1)
               setfoodPower(foodPower + 0.1);
          }
          else {
               AudioErrPlay();
          }
     }
     function UpgradeCoin() {
          if (coin >= coinUpdatePrice) {
               SoundUpgradeItem();
               setcoin(coin -= coinUpdatePrice)
               setcoinLevel(coinLevel + 1);
               setcoinPower(coinPower + 1);
          } else {
               AudioErrPlay();
          }
     }
     function UpgradeWoodCutter() {
          if (coin >= woodcutterUpdatePrice) {
               setcoin(coin -= woodcutterUpdatePrice)
               new Audio(soundUpgradeItem).play();
               setwoodCutterLevel(woodCutterLevel + 1);
               setwoodCutterPower(woodCutterPower + 0.01);
          }
          else {
               AudioErrPlay();
          }
     }
     useEffect(() => {
          setchopUpdatePrice(1.5 * (chopLevel + 1) * (chopPower * 8.2));
          setwoodcutterUpdatePrice(1.5 * (woodCutterLevel + 1) * (woodCutterPower * 80.2))
          setfoodUpdatePrice(1.5 * (foodLevel + 1) * (foodPower * 8.2));
          setcoinUpdatePrice(10 * (coinLevel + 1) * ((coinPower) * 100));
     }, [chopLevel, woodCutterLevel, foodLevel, coinLevel])
     function SellWood(percent) {

          if (woodAmount <= 0.01) {
               woodAmount = 0;
               AudioErrPlay();
          }
          if (woodAmount >= 0.01) {
               new Audio(soundSellItem).play();
               var sold = woodAmount * percent / 100;
               console.log("satılacak" + sold);
               coin += (sold * coinPower);
               woodAmount -= sold;

               StoragePercentCalculate();
               setcoin(coin);
               StorageControl()
          }
     }
     function CleanData() {

          data = {
               wood: 0,
               woodCutter: 0,
               coin: 0,
               storage: 100
          }
          localStorage.setItem("dataTest", JSON.stringify(data));
     }
     return (
          <>
               {/* {resourceWoodStorage} <br />
               {storagePercentCalculate} */}
               {/* {resourceWood} */}
               <div id="game_title_holder" >
                    <div className="d-flex align-items-end">
                         <Icon iconName="nature" size="35" />
                    </div>
                    <span>    COLLECT & SELL</span>

                    <div className="d-flex align-items-end">
                         <Icon iconName="nature" size="35" />
                    </div>

               </div>
               <div id="top_general_info" className="container d-flex justify-content-between">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                         <div id="coin_info_holder" className="d-flex align-items-center">
                              <Icon iconName="local_atm" color="236,204,123" size="35" />
                              <span>{(coin).toFixed(2)}</span >
                         </div>
                         <div style={{ width: `100%`, height: "5px", backgroundColor: "yellow" }}>

                         </div>
                    </div>



                    <div id="profile_level_holder" className="d-flex flex-column align-items-end">
                         <span>{profileStats.Level} lv.</span>
                         <span>{profileStats.Experiance.toFixed(2)} / {profileStats.ExperianceTo * profileStats.Level}</span>
                    </div>
               </div>
               <div className="container p-0">
                    <div style={{ backgroundColor: "rgb(77, 136, 255)", width: `${storagePercentCalculate}%`, height: "4px" }}>
                    </div>
               </div>
               <div className="container">
                    <div className="row">
                         <div className="col p-0">
                              <div className="d-flex flex-column">
                                   <div id="resource_holder">
                                        <div id="resource_wood" className="">
                                             <div className="d-flex align-items-center">
                                                  <Icon iconName="nature" />
                                                  <span id="text_priceA" className="ms-3"> 0.00 </span>  <span> / </span> <span id="storage_capacity"> {resourceWoodStorage} </span>
                                             </div>

                                        </div>
                                        <div id="resource_stone" className="">
                                             <div className="d-flex align-items-center">

                                                  <Icon iconName="landscape" />

                                                  <span className="ms-3">0</span> / <span ></span>
                                             </div>

                                             <span id='text_storage_full'></span>

                                        </div>
                                        <div id="resource_meat" className="">
                                             <div className="d-flex align-items-center">
                                                  <Icon iconName="egg_alt" />
                                                  <span id="text_priceB" className="ms-3"> 0.00 </span>    <span> / </span> <span > {resourceFoodStorage}</span>
                                             </div>

                                        </div>

                                   </div>
                                   <span id='text_error'></span>
                                   <hr/>

                                   <div id="general_information_holder" className="d-flex  justify-content-center align-items-center">
                                        <span className="mx-1 d-flex align-items-center">
                                             <Icon iconName="egg_alt" size="17" />
                                               -{humanityVariables.FoodReduce.toFixed(2)}/s
                                        </span>
                                        <span className="mx-1 d-flex align-items-center">
                                             <Icon iconName="home" size="17" />
                                        {humanityVariables.Population}/{humanityVariables.House}</span>
                                   </div>
                                   <hr/>

                              </div>
                         </div>
                    </div>
               </div>
               {/* WOOD TASK CONTAINER START */}

               <div className="container p-0 py-2">
                    <div id="wood_tasks" className="">
                         <div className="row  m-0 p-0 mt-2  justify-content-center">
                              <div className="button_holder m-1 col-12 col-lg-5  p-0">
                                   <div>
                                        <button id='chop_wood' type="button" onClick={() => { WoodCollect() }} className='d-flex align-items-center justify-content-center'>
                                             <Icon iconName="nature" />
                                             <span>Chop +{1}</span>
                                        </button>
                                   </div>
                                   <div>
                                        <ItemInformation description="Chop chop chop. Collect Wood&Sell. Also you will need woods to build stuffs or upgrade" />

                                   </div>
                                   <div className="detail_holder">
                                        <Detail title="Lv." value={chopLevel.toFixed(0)} />
                                        <Detail title="Power" value={chopPower.toFixed(2)} />

                                   </div>
                                   <div>
                                        <ItemUpgrade buttonclick={UpgradeChop} upgradeprice={(chopUpdatePrice)} currentprice={coin} />
                                   </div>

                              </div>
                              <div className="button_holder m-1 col-12 col-lg-5   p-0">
                                   <button id='hunt_food' type="button" onClick={() => { FoodCollect() }} className='d-flex align-items-center justify-content-center'>
                                        <Icon iconName="egg_alt" />
                                        <span>Food + {1}</span>
                                   </button>
                                   <ItemInformation description="Everybody you own will get hungry. You need to collect food because your woodcutters need food. Also you need food to make more woodcutters" />

                                   <div className="detail_holder">
                                        <Detail title="Lv." value={foodLevel.toFixed(0)} />
                                        <Detail title="Power" value={foodPower.toFixed(2)} />

                                   </div>
                                   <ItemUpgrade buttonclick={UpgradeFood} upgradeprice={(foodUpdatePrice)} currentprice={coin} />
                              </div>
                         </div>
                         <div className="row  m-0 p-0 mt-2  justify-content-center">
                              <div className="button_holder m-1  col-12 col-lg-5 p-0">
                                   <button id='sell_wood' onClick={() => { SellWood(100) }} type="button" className='d-flex justify-content-center'>
                                        <Icon iconName="sell" />
                                        <span>Sell Wood</span>
                                   </button>
                                   <ItemInformation description="Everybody needs money. You can sell collected woods and earn coin. With coin you can upgrade your stuffs like woodcutter, chop etc. " />

                                   <div className="detail_holder">
                                        <Detail title="Lv." value={coinLevel} />

                                        <div className="d-flex justify-content-between px-1 sell_wood_holder">
                                             < >Sell</ >
                                             <span onClick={() => { SetAutoSellActiveDeactive() }}

                                                  style={
                                                       isAutoSellActive === true ? { backgroundColor: "rgb(236, 204, 123)" } : { backgroundColor: "rgba(236, 204, 123,0)" }
                                                  }
                                             >Auto Sell</span>
                                             <span onClick={() => { SellWood(10) }} >10%</span>
                                             <span onClick={() => { SellWood(25) }} >25%</span>
                                             <span onClick={() => { SellWood(50) }} >50%</span>
                                        </div>
                                        <Detail title="Sell For" value={coinPower} />
                                   </div>
                                   <ItemUpgrade buttonclick={UpgradeCoin} upgradeprice={(coinUpdatePrice)} currentprice={coin} />


                              </div>
                         </div>
                         <div className="row  m-0 p-0 mt-2  justify-content-center">
                              <div className="button_holder m-1 col-12 col-lg-5  p-0">
                                   <button id='buy_woodcutter' onClick={() => { BuyWoodcutter() }} type="button" className='d-flex justify-content-between'>
                                        <div className="d-flex align-items-center">
                                             <Icon iconName="man" />
                                             <span>Woodcutter +1</span>
                                        </div>

                                        <div className="item_buy_style d-flex">
                                             <ItemBuy iconName="local_atm" price={woodcutterPrice.coin} currentamount={coin} />
                                             <ItemBuy iconName="nature" price={woodcutterPrice.wood} currentamount={woodAmount} />
                                             <ItemBuy iconName="egg_alt" price={woodcutterPrice.food} currentamount={foodAmount} />
                                        </div>
                                   </button>
                                   <ItemInformation description="Each woodcutter eats 0.02 meat every second, otherwise they won't work" />
                                   <div className="detail_holder">
                                        <Detail title=" Lv." value={(woodCutterLevel).toFixed(0)} />
                                        <Detail title="Amount" value={woodCutter} />
                                        <Detail title="Power" value={woodCutterPower.toFixed(2)} />
                                   </div>
                                   <div>

                                        <ItemUpgrade buttonclick={UpgradeWoodCutter} upgradeprice={(woodcutterUpdatePrice)} currentprice={coin} />

                                   </div>
                              </div>
                              <div className="button_holder col-12 col-lg-5  m-1 p-0  " >
                                   <button id='buy_storage' onClick={() => { BuyStorage() }} type="button" className='d-flex align-items-center justify-content-between '>
                                        <div className="d-flex align-items-center">
                                             <Icon iconName="warehouse" />
                                             <span>Wood storage x2 </span>
                                        </div>
                                        <div className="item_buy_style d-flex">
                                             <ItemBuy iconName="local_atm" price={storagePrice.coin} currentamount={coin} />
                                             <ItemBuy iconName="nature" price={storagePrice.wood} currentamount={woodAmount} />

                                        </div>
                                   </button>
                                   <ItemInformation description="If you want to collect wood, you need Wood Storage. Each level increases x2 times storage capacity. Otherwise you cant collect wood more than storage capacity " />

                                   <div className="detail_holder">
                                        <Detail title="Full" value={storagePercentCalculate.toFixed(2) + "%"} />
                                        <Detail title="Full in" value={storageRemainingTime.toFixed(1) + "/s"} />
                                        <Detail title="Capacity" value={resourceWoodStorage} />
                                   </div>
                              </div>
                         </div>

                    </div>
               </div>


               {/* WOOD TASK CONTAINER END */}


               <button onClick={() => { SaveGame(); }} type="button" className="btn btn-primary "> SAVE GAME</button>
               <button onClick={() => { CleanData(); }} type="button" className="btn btn-danger "> CLEAN DATA</button>



          </>
     )
}

export default Increment