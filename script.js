// 配置信息（直接修改这里来改变菜品）
let config = {
    "title": "公主今天吃什么？",
    "prizes": [
        {
            "id": 1,
            "name": "🌶",
            "description": "辣椒炒肉",
            "color": "#FF6B6B"
        },
        {
            "id": 2,
            "name": "🍣",
            "description": "寿司",
            "color": "#4ECDC4"
        },
        {
            "id": 3,
            "name": "🥘",
            "description": "麻婆豆腐",
            "color": "#FF7043"
        },
        {
            "id": 4,
            "name": "🐟",
            "description": "无骨烤鱼饭",
            "color": "#66BB6A"
        },
        {
            "id": 5,
            "name": "🐠",
            "description": "松鼠鱼",
            "color": "#FFEAA7"
        },
        {
            "id": 6,
            "name": "🍖",
            "description": "糖醋里脊",
            "color": "#EF5350"
        },
        {
            "id": 7,
            "name": "🍗",
            "description": "韩式炸鸡块",
            "color": "#FFA726"
        },
        {
            "id": 8,
            "name": "🥩",
            "description": "红烧肉",
            "color": "#D84315"
        },
        {
            "id": 9,
            "name": "🥢",
            "description": "鱼香肉丝",
            "color": "#FF9800"
        },
        {
            "id": 10,
            "name": "🦆",
            "description": "北京烤鸭",
            "color": "#8B4513"
        },
        {
            "id": 11,
            "name": "🥛",
            "description": "奶茶小面包",
            "color": "#E8B4B8"
        },
        {
            "id": 12,
            "name": "🥟",
            "description": "小笼包炒米线",
            "color": "#FFA07A"
        },
        {
            "id": 13,
            "name": "🥣",
            "description": "馄炖",
            "color": "#FFE4B5"
        }
    ],
    "gridSize": 13,
    "animationSpeed": 100
};

let isDrawing = false;
let currentIndex = 0;
let intervalId = null;

// 加载配置文件
async function loadConfig() {
    try {
        // 尝试从外部文件加载
        const response = await fetch('config.json');
        const externalConfig = await response.json();
        config = externalConfig;
    } catch (error) {
        // 如果加载失败，使用内置配置
        console.log('使用内置配置');
    }
    initializeLottery();
}

// 初始化抽奖系统
function initializeLottery() {
    // 设置标题
    document.getElementById('title').textContent = config.title;
    
    // 生成抽奖方块
    generateLotteryGrid();
    
    // 显示奖品列表
    displayPrizeList();
    
    // 绑定事件
    document.getElementById('startBtn').addEventListener('click', startLottery);
    document.getElementById('confirmBtn').addEventListener('click', () => {
        closeModal();
        // 重置状态
        const boxes = document.querySelectorAll('.lottery-box');
        boxes.forEach(box => {
            box.classList.remove('active', 'winner');
        });
        currentIndex = 0;
    });
}

// 生成抽奖方块
function generateLotteryGrid() {
    const grid = document.getElementById('lotteryGrid');
    grid.innerHTML = '';
    
    const gridSize = config.prizes.length;
    
    // 根据屏幕大小调整半径
    const isMobile = window.innerWidth <= 600;
    const radius = isMobile ? 110 : 200; // 移动端用更小的半径
    const centerX = isMobile ? 140 : 250;
    const centerY = isMobile ? 140 : 250;
    const boxSize = isMobile ? 60 : 100;
    
    for (let i = 0; i < gridSize; i++) {
        const box = document.createElement('div');
        box.className = 'lottery-box';
        box.dataset.index = i;
        
        // 计算圆形位置
        const angle = (i / gridSize) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - boxSize / 2;
        const y = centerY + radius * Math.sin(angle) - boxSize / 2;
        
        box.style.left = x + 'px';
        box.style.top = y + 'px';
        
        // 按顺序显示每个菜品
        const prize = config.prizes[i];
        box.style.background = prize.color;
        
        box.innerHTML = `
            <div class="box-name">${prize.name}</div>
            <div class="box-desc">${prize.description}</div>
        `;
        
        grid.appendChild(box);
    }
}

// 显示奖品列表（已禁用）
function displayPrizeList() {
    // 不再显示列表
}

// 随机选择菜品
function getRandomPrize() {
    const randomIndex = Math.floor(Math.random() * config.prizes.length);
    return config.prizes[randomIndex];
}

// 开始抽奖
function startLottery() {
    if (isDrawing) return;
    
    isDrawing = true;
    document.getElementById('startBtn').disabled = true;
    
    const boxes = document.querySelectorAll('.lottery-box');
    let rounds = 0;
    const maxRounds = 20 + Math.floor(Math.random() * 10); // 随机旋转次数
    
    intervalId = setInterval(() => {
        // 移除当前高亮
        boxes[currentIndex].classList.remove('active');
        
        // 移动到下一个
        currentIndex = (currentIndex + 1) % boxes.length;
        
        // 添加高亮
        boxes[currentIndex].classList.add('active');
        
        rounds++;
        
        // 减速效果
        if (rounds > maxRounds) {
            clearInterval(intervalId);
            finishLottery(boxes[currentIndex]);
        }
    }, config.animationSpeed || 100);
}

// 完成抽奖
function finishLottery(winnerBox) {
    winnerBox.classList.add('winner');
    
    const prizeName = winnerBox.querySelector('.box-name').textContent;
    const prizeDesc = winnerBox.querySelector('.box-desc').textContent;
    
    setTimeout(() => {
        // 显示弹框
        showModal(prizeName, prizeDesc);
        
        isDrawing = false;
        document.getElementById('startBtn').disabled = false;
    }, 1000);
}

// 显示弹框
function showModal(emoji, description) {
    const modal = document.getElementById('resultModal');
    document.getElementById('modalEmoji').textContent = emoji;
    document.getElementById('modalPrize').textContent = description;
    modal.classList.add('show');
}

// 关闭弹框
function closeModal() {
    const modal = document.getElementById('resultModal');
    modal.classList.remove('show');
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', loadConfig);
