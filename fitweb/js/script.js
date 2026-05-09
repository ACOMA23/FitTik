document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calorie-form');
    const resultsContent = document.getElementById('results-content');
    const resultCalories = document.getElementById('result-calories');
    const proteinG = document.getElementById('protein-g');
    const carbsG = document.getElementById('carbs-g');
    const fatsG = document.getElementById('fats-g');
    
    const genderBtns = document.querySelectorAll('.gender-btn');
    let selectedGender = 'male';

    genderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            genderBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedGender = this.dataset.gender;
        });
    });

    const ctx = document.getElementById('macrosChart').getContext('2d');
    let macrosChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['انتظار البيانات'],
            datasets: [{
                data: [100],
                backgroundColor: ['#1f2937'],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const age = parseFloat(document.getElementById('age').value);
        const activityValue = parseFloat(document.getElementById('activity-level').value);
        const lossDeficit = parseFloat(document.getElementById('loss-rate').value); // العجز المختار

        if (isNaN(activityValue)) {
            alert("يرجى اختيار مستوى النشاط");
            return;
        }

       
        let bmr;
        if (selectedGender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        
        const tdee = bmr * activityValue;

        
        let targetCalories = Math.round(tdee - lossDeficit);

        
        if (targetCalories < 1200) targetCalories = 1200;

        
        const pG = Math.round((targetCalories * 0.30) / 4);
        const cG = Math.round((targetCalories * 0.40) / 4);
        const fG = Math.round((targetCalories * 0.30) / 9);

       
        resultsContent.style.opacity = "1";
        animateNumber(resultCalories, 0, targetCalories, 1000);
        proteinG.innerText = pG;
        carbsG.innerText = cG;
        fatsG.innerText = fG;

        updateMacrosChart(pG, cG, fG);

            window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
    
    });

    function updateMacrosChart(p, c, f) {
        macrosChart.data.labels = ['بروتين', 'كاربوهيدرات', 'دهون'];
        macrosChart.data.datasets[0].data = [p, c, f];
        macrosChart.data.datasets[0].backgroundColor = ['#3b82f6', '#a855f7', '#22c55e'];
        macrosChart.options.plugins.tooltip.enabled = true;
        macrosChart.update();
    }

    function animateNumber(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerText = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }
});