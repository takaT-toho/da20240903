document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let totalPages = 5;
    let timer = 30;
    let coins = 0;

    // モーダル操作
    const modal = document.getElementById('modal');
    const startButton = document.getElementById('startButton');
    const countdown = document.getElementById('countdown');
    const timerElement = document.getElementById('timer');
    const coinCountElement = document.getElementById('count');

    startButton.addEventListener('click', startCountdown);

    function startCountdown() {
        let count = 3;
        startButton.style.display = 'none';
        countdown.innerText = count;

        let interval = setInterval(() => {
            count--;
            if (count === 0) {
                countdown.innerText = 'Go!';
            } else if (count == -1) {                
		clearInterval(interval);
                modal.style.display = 'none';
                startTimer();
		} else {
                countdown.innerText = count;
            }
        }, 1000);
    }

    function startTimer() {
        let interval = setInterval(() => {
            timer--;
            timerElement.innerText = timer;

            if (timer === 0 || currentPage > totalPages) {
                clearInterval(interval);
                addCoins(timer);
            }
        }, 1000);
    }

    function addCoins(remainingTime) {
        for (let i = 0; i < remainingTime; i++) {
            setTimeout(function() {
                coins++;
                coinCountElement.innerText = coins;
                generateCoinAnimation(i);
            }, i * 500);
        }
    }

    function generateCoinAnimation(i) {
        const coinEl = document.createElement("div");
        coinEl.textContent = `💰+${i+1}`;
        coinEl.classList.add("drop-coin");
        document.getElementById("coins-container").appendChild(coinEl);
        playCoinSound();
        setTimeout(() => {
            coinEl.remove();
        }, 800);
    }

    function updatePage() {
        document.querySelectorAll('.page').forEach((page, index) => {
            page.style.display = (index + 1 === currentPage) ? 'block' : 'none';
        });
        document.getElementById('pageNumber').innerText = `${currentPage}/${totalPages}`;
    }

    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            animateCoin();
        } else if (currentPage === totalPages) {
		    currentPage++;
            startFinishAnimation();
        }
        updatePage();
	    createCoinAnimation();
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    }

    function playCoinSound() {
        let coinSound = document.getElementById('coinSound');
        coinSound.currentTime = 0; // 再生位置をリセット
        coinSound.play(); // 音を再生
    }

    function createCoinAnimation() {
        // const coinSVG = document.getElementById("coin-icon").querySelector('svg').cloneNode(true);
        const coinIcon = document.getElementById("coin-icon");
        const coin = document.createElement('div');
        coin.innerHTML = coinIcon.innerHTML;
        coin.className = 'coin';
        coin.style.left = '50%';
        coin.style.top = '50%';
        document.body.appendChild(coin);
      
        const coinRect = coin.getBoundingClientRect(); // コインの位置とサイズを取得
      
        // 10個の小さな星を生成
        for (let i = 0; i < 10; i++) {
          const star = document.createElement('div');
          star.className = 'star';
      
          // SVGでの星の描画
          const starSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          starSvg.setAttribute('viewBox', '0 0 24 24');
          starSvg.setAttribute('width', '16');
          starSvg.setAttribute('height', '16');
          const starPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          starPath.setAttribute('d', 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z');
          starSvg.appendChild(starPath);
          star.appendChild(starSvg);
      
            // コインの中心から半径30px以内のランダムな位置を計算
          const angle = Math.random() * 2 * Math.PI;
          const radius = Math.random() * 30;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
      
          // 星の位置をランダムに設定
          star.style.left = `${coinRect.left + window.scrollX + x}px`;
          star.style.top = `${coinRect.top + window.scrollY + 50 + y - 100}px`;
          star.style.transform = 'scale(0)';
          document.body.appendChild(star);
      
          // 星のアニメーション
          star.animate([
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0)', opacity: 0 }
          ], {
            duration: 500,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            delay: i * 100
          }).onfinish = () => star.remove();
        }

        playCoinSound();
      
        // コインのアニメーション
        coin.animate([
          { transform: 'translateY(0) scale(1)', opacity: 1 },
          { transform: 'translateY(-100px) scale(1.5)', opacity: 1 },
          { transform: 'translateY(0) scale(1)', opacity: 0 }
        ], {
          duration: 1000,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        }).onfinish = () => coin.remove();
      }


    function animateCoin() {
        coins++;
        coinCountElement.innerText = coins;
        
        const coinIcon = document.getElementById('coin-icon');

        coinIcon.classList.add('animate-coin');
        setTimeout(() => {
            coinIcon.classList.remove('animate-coin');
            coinIcon.offsetWidth;
        }, 800);
    }

    document.querySelector('.right-arrow').addEventListener('click', nextPage);
    document.querySelector('.left-arrow').addEventListener('click', prevPage);

    // FINISH画面のアニメーションを開始する関数
    function startFinishAnimation() {
        const finishScreen = document.querySelector('.finish-screen');
        finishScreen.style.opacity = 0;
        finishScreen.style.transform = 'scale(0.8)';
        
        // FINISH画面が表示されるアニメーション
        setTimeout(() => {
            finishScreen.style.transition = 'opacity 1s ease, transform 1s ease';
            finishScreen.style.opacity = 1;
            finishScreen.style.transform = 'scale(1)';
        }, 0);
    }

    updatePage();

    const maxCount = 30;
    const minCount = 0;
    const gaugeElement = document.getElementById('lifeGauge');

    const innerDiv = document.createElement('div');
    innerDiv.className = 'inner';
    gaugeElement.appendChild(innerDiv);

    function updateGauge() {
        let count = timer;
        // count の値を 0 から 100 の範囲にマッピング
        const percentage = ((count - minCount) / (maxCount - minCount)) * 100;

        if (percentage === 10) {
            document.getElementById("heart-icon").classList.add("heartbeat");
        } else if (percentage === 20) {
            innerDiv.classList.remove("yellow");
            innerDiv.offsetWidth;
            innerDiv.classList.add("red");
        } else if (percentage === 50) {
            innerDiv.classList.add("yellow");
        }

        // CSSで幅を設定
        innerDiv.style.width = percentage + '%';
        
        setTimeout(updateGauge, 1000);
    }

    // 初期化
    updateGauge();


    document.getElementById('finishButton').onclick = function() {
        location.reload();
    };
});
