let weight = 0, height = 0, age = 0, activityLevel = 0, lossRate = 0, targetCalories = 0, BMR = 0, genderValue = 0;
let myMacrosChart = null;
function gender(btn) {
    const type = btn.getAttribute('data-gender');
    genderValue = (type === 'male') ? 0 : 1;
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function userInput() {
    // حذفنا let لنعدل المتغيرات العامة فوق
    weight = parseFloat(document.getElementById('weight').value);
    height = parseFloat(document.getElementById('height').value);
    age = parseFloat(document.getElementById('age').value);
    activityLevel = parseFloat(document.getElementById('activity-level').value);
    lossRate = parseFloat(document.getElementById('loss-rate').value);
}

function BMRcal() {
    // تصحيح المقارنة === وحذف let
    if (genderValue === 0) {
        BMR = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        
    }
    return BMR;
}

function Calories() {
    // استخدام BMR المحسوبة
    targetCalories = (BMR * activityLevel) - lossRate;
    return targetCalories;
}

function Macronutrients() {
    let protein = Math.round((targetCalories * 0.30) / 4);
    let carbs = Math.round((targetCalories * 0.40) / 4);
    let fats = Math.round((targetCalories * 0.30) / 9);
    let totalCals = Math.round(targetCalories);

    // 1. أنميشن الأرقام
    const animateNumber = (elementId, targetValue) => {
        let startValue = 0;
        let duration = 1200; 
        let stepTime = 30; 
        let increment = targetValue / (duration / stepTime);
        
        let timer = setInterval(() => {
            startValue += increment;
            if (startValue >= targetValue) {
                document.getElementById(elementId).innerText = Math.round(targetValue);
                clearInterval(timer);
            } else {
                document.getElementById(elementId).innerText = Math.round(startValue);
            }
        }, stepTime);
    };

    animateNumber('protein-g', protein);
    animateNumber('carbs-g', carbs);
    animateNumber('fats-g', fats);
    animateNumber('result-calories', totalCals);

    document.getElementById('results-content').style.opacity = "1";
    document.getElementById('results-content').style.pointerEvents = "auto";

    // 2. أنميشن الدائرة وألوان متطابقة مع الصورة
    const ctx = document.getElementById('macrosChart').getContext('2d');
    if (myMacrosChart) { myMacrosChart.destroy(); }

    myMacrosChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['البروتين', 'الكارب', 'الدهون'],
            datasets: [{
                data: [protein, carbs, fats],
                backgroundColor: [
                    '#4285F4', // الأزرق للبروتين
                    '#A142F4', // البنفسجي للكارب
                    '#34A853'  // الأخضر للدهون
                ],
                borderWidth: 0, // إلغاء الحدود لتبدو ناعمة مثل الصورة
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%', // تجويف أكبر ليعطي شكل الحلقة النحيفة
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1500,
                easing: 'easeOutQuart' // حركة ناعمة جداً في النهاية
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        }
    });
}

// دالة واحدة تجمعهم كلهم ليتم استدعاؤها عند الضغط على الزر
function calculateAll() {
    userInput();
    BMRcal();
    Calories();
    Macronutrients();
}
