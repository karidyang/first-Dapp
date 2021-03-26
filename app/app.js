

window.onload = async function () {
  // import detectEthereumProvider from '@metamask/detect-provider'
  var web3, guess_contract, guess_result, refresh_timer;
  
  const accounts = await ethereum.request({ method: 'eth_accounts' });
  const provider = await detectEthereumProvider()
  web3 = new Web3(provider);
  const defaultAccount = accounts[0];
  console.info(defaultAccount)
  // if (typeof window.web3 !== "undefined") {
  //   // 安装Metamask插件后web3已经定义在window对象下
  //   console.info(11111111);
  //   web3 = new Web3(window.web3.currentProvider);
  //   if (window.ethereum) {
  //     // 请求用户授权
  //     web3.currentProvider.request({method:'eth_requestAccounts'}).then((accounts) => {
  //       console.info(444444);
  //       console.log(accounts);
  //       // web3.eth.getAccounts((error, accounts) => {
  //       //   console.info(5555);

  //       web3.eth.defaultAccount = accounts[0];
  //       //   console.log(accounts);
  //       // });
  //     }).catch((err) => console.error(err));
  //   }
  // } else {
  //   console.info(2222222);
  //   web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  // }

  // 获取智能合约的ABI（Application Binary Interface）文件
  $.getJSON("GuessGame.json", function (data) {
    var GuessGameArtifact = data;

    // 初始化智能合约
    GuessGameContract = TruffleContract(GuessGameArtifact);
    GuessGameContract.setProvider(provider);

    // 通过默认的合约地址获取实例
    GuessGameContract.deployed()
      .then(function (instance) {
        console.info(333333333);
        guess_contract = instance;
        guess_contract.GuessResult(function (err, result) {
          if (!err) {
            var player_choice = result.args.playerChoice.toNumber();
            var computer_choice = result.args.computerChoice.toNumber();
            var r = result.args.result.toNumber();
            var info = "未知";
            if (r == 1) {
              info = "平手";
            } else if (r == 2) {
              info = "你输了";
            } else if (r == 3) {
              info = "你赢了";
            }
            update_page(player_choice, computer_choice, info);
          } else {
            console.log(err);
          }
        });
      })
      .catch(function (err) {
        console.info(444444444);
        console.log(err.message);
      });
  });

  /*
    更新页面显示
  */
  function update_page(player, computer, result) {
    var info = document.getElementById("info");
    var playerImg = document.getElementById("player");
    var comImg = document.getElementById("computer");
    info.style.opacity = "0";
    clearInterval(refresh_timer);
    playerImg.src = "images/" + player + ".png";
    comImg.src = "images/" + computer + ".png";
    info.style.opacity = 1;
    info.innerText = result;
  }

  /*
    猜拳
  */
  function guess(player_choice) {
    // 1:石头、2:剪刀、3:布
    var result;
    player_choice = parseInt(player_choice);
    computer_choice = parseInt(Math.random() * 3) + 1; // 电脑
    document.getElementById("info").innerText = "";
    guess_contract.play
      .sendTransaction(player_choice, computer_choice, {
        from: defaultAccount,
        to: "0xbF22249A70e4163344bc0af415e62E2e27a163F2",
        value: web3.toWei(0, "ether"),
      })
      .then(function (result) {
        if (result) {
          var playerImg = document.getElementById("player");
          var comImg = document.getElementById("computer");
          refresh_timer = setInterval(function () {
            this.n ? this.n : (this.n = 1);
            this.n++;
            this.n > 3 ? (this.n = 1) : this.n;
            playerImg.src = "images/" + this.n + ".png";
            comImg.src = "images/" + this.n + ".png";
          }, 100);
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  }

  // 绑定页面按钮事件
  choices = $("button");
  for (var i = 0; i < choices.length; i++) {
    choices[i].onclick = function () {
      guess(this.value);
    };
  }
};
