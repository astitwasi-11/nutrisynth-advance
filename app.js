/* ============================================================
   NUTRISYNTH PREMIUM - APPLICATION LOGIC
   ============================================================ */

// Application State
const appState = {
    currentPage: 'landing',
    onboardingStep: 1,
    userProfile: {
        age: null,
        gender: null,
        height: null,
        weight: null,
        activity: null,
        goal: null,
        dietaryPreference: null,
        restrictions: [],
        allergies: [],
        intolerances: []
    },
    calculations: {
        bmr: null,
        tdee: null,
        protein: null,
        carbs: null,
        fat: null,
        fiber: null
    },
    meals: [],
    mealAnalysis: []
};

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupSmoothScroll();
});

function initializeEventListeners() {
    // Hero CTA Buttons
    const ctaButtons = document.querySelectorAll('#ctaPrimary, #ctaStart, #ctaSecondary, .nav-btn-start, #navStartBtn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', () => startOnboarding());
    });
    
    // Explore button
    const exploreBtn = document.querySelector('#ctaSecondary');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#how-it-works').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ============================================================
// ONBOARDING FLOW
// ============================================================

function startOnboarding() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.display = 'none';
    }
    
    document.querySelector('#appContainer').style.display = 'block';
    appState.currentPage = 'onboarding';
    appState.onboardingStep = 1;
    renderOnboarding();
    
    // Hide other sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    document.querySelector('.footer').style.display = 'none';
    document.querySelector('.navbar').style.display = 'none';
}

function renderOnboarding() {
    const container = document.querySelector('#appContainer');
    const step = appState.onboardingStep;
    
    let content = '';
    content += renderProgressBar();
    
    switch(step) {
        case 1:
            content += renderStep1();
            break;
        case 2:
            content += renderStep2();
            break;
        case 3:
            content += renderStep3();
            break;
        case 4:
            content += renderStep4();
            break;
        case 5:
            content += renderStep5();
            break;
        case 6:
            content += renderStep6();
            break;
        case 7:
            renderDashboard();
            return;
    }
    
    container.innerHTML = content;
    attachStepListeners();
}

function renderProgressBar() {
    const steps = ['Personal', 'Body', 'Lifestyle', 'Diet', 'Goals', 'Preferences'];
    const progress = (appState.onboardingStep / steps.length) * 100;
    
    return `
        <div class="onboarding-container">
            <div class="onboarding-header">
                <button class="btn-back" onclick="goBackStep()">← Back</button>
                <h2>Build Your Profile</h2>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="progress-text">${appState.onboardingStep} of ${steps.length}</div>
                <div class="progress-labels">
                    ${steps.map((s, i) => `
                        <span class="progress-label ${i + 1 <= appState.onboardingStep ? 'active' : ''}">${s}</span>
                    `).join('')}
                </div>
            </div>
            <div class="onboarding-content">
    `;
}

function renderStep1() {
    return `
        <div class="step-form">
            <h3>👤 About You</h3>
            <p class="step-description">Let's start with some basic information.</p>
            
            <div class="form-group">
                <label>Age (years)</label>
                <input type="number" id="age" min="1" max="150" value="${appState.userProfile.age || ''}" placeholder="e.g., 25">
                <span class="input-helper">This helps calculate your nutritional requirements.</span>
            </div>
            
            <div class="form-group">
                <label>Gender</label>
                <div class="option-group">
                    <label class="option-label">
                        <input type="radio" name="gender" value="male" ${appState.userProfile.gender === 'male' ? 'checked' : ''}>
                        <span>Male</span>
                    </label>
                    <label class="option-label">
                        <input type="radio" name="gender" value="female" ${appState.userProfile.gender === 'female' ? 'checked' : ''}>
                        <span>Female</span>
                    </label>
                    <label class="option-label">
                        <input type="radio" name="gender" value="other" ${appState.userProfile.gender === 'other' ? 'checked' : ''}>
                        <span>Other</span>
                    </label>
                </div>
            </div>
            
            <button class="btn btn-primary btn-next" onclick="validateAndNext(1)">Continue →</button>
        </div>
        </div>
    `;
}

function renderStep2() {
    return `
        <div class="step-form">
            <h3>📏 Body Information</h3>
            <p class="step-description">Help us understand your physical metrics.</p>
            
            <div class="form-group">
                <label>Height (cm)</label>
                <input type="number" id="height" min="100" max="250" value="${appState.userProfile.height || ''}" placeholder="e.g., 175">
            </div>
            
            <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" id="weight" min="20" max="300" step="0.1" value="${appState.userProfile.weight || ''}" placeholder="e.g., 70">
            </div>
            
            <button class="btn btn-primary btn-next" onclick="validateAndNext(2)">Continue →</button>
        </div>
        </div>
    `;
}

function renderStep3() {
    return `
        <div class="step-form">
            <h3>🏃 Lifestyle</h3>
            <p class="step-description">What's your typical activity level?</p>
            
            <div class="activity-options">
                <label class="activity-card ${appState.userProfile.activity === 'sedentary' ? 'selected' : ''}">
                    <input type="radio" name="activity" value="sedentary">
                    <span class="activity-name">Sedentary</span>
                    <span class="activity-desc">Minimal exercise</span>
                </label>
                <label class="activity-card ${appState.userProfile.activity === 'light' ? 'selected' : ''}">
                    <input type="radio" name="activity" value="light">
                    <span class="activity-name">Light</span>
                    <span class="activity-desc">1-3 days/week</span>
                </label>
                <label class="activity-card ${appState.userProfile.activity === 'moderate' ? 'selected' : ''}">
                    <input type="radio" name="activity" value="moderate">
                    <span class="activity-name">Moderate</span>
                    <span class="activity-desc">3-5 days/week</span>
                </label>
                <label class="activity-card ${appState.userProfile.activity === 'active' ? 'selected' : ''}">
                    <input type="radio" name="activity" value="active">
                    <span class="activity-name">Active</span>
                    <span class="activity-desc">6-7 days/week</span>
                </label>
            </div>
            
            <button class="btn btn-primary btn-next" onclick="validateAndNext(3)">Continue →</button>
        </div>
        </div>
    `;
}

function renderStep4() {
    return `
        <div class="step-form">
            <h3>🥗 Diet Preference</h3>
            <p class="step-description">What's your dietary preference?</p>
            
            <div class="diet-options">
                <label class="diet-card ${appState.userProfile.dietaryPreference === 'non-veg' ? 'selected' : ''}">
                    <input type="radio" name="diet" value="non-veg">
                    <span class="diet-name">Non-Vegetarian</span>
                    <span class="diet-desc">Includes meat, fish, eggs</span>
                </label>
                <label class="diet-card ${appState.userProfile.dietaryPreference === 'vegetarian' ? 'selected' : ''}">
                    <input type="radio" name="diet" value="vegetarian">
                    <span class="diet-name">Vegetarian</span>
                    <span class="diet-desc">No meat or fish, includes dairy</span>
                </label>
                <label class="diet-card ${appState.userProfile.dietaryPreference === 'vegan' ? 'selected' : ''}">
                    <input type="radio" name="diet" value="vegan">
                    <span class="diet-name">Vegan</span>
                    <span class="diet-desc">Plant-based only</span>
                </label>
            </div>
            
            <button class="btn btn-primary btn-next" onclick="validateAndNext(4)">Continue →</button>
        </div>
        </div>
    `;
}

function renderStep5() {
    return `
        <div class="step-form">
            <h3>🎯 Goals</h3>
            <p class="step-description">What's your nutrition goal?</p>
            
            <div class="goal-options">
                <label class="goal-card ${appState.userProfile.goal === 'maintain' ? 'selected' : ''}">
                    <input type="radio" name="goal" value="maintain">
                    <span class="goal-name">Maintain</span>
                    <span class="goal-desc">Keep current weight</span>
                </label>
                <label class="goal-card ${appState.userProfile.goal === 'lose' ? 'selected' : ''}">
                    <input type="radio" name="goal" value="lose">
                    <span class="goal-name">Lose Weight</span>
                    <span class="goal-desc">Healthy weight loss</span>
                </label>
                <label class="goal-card ${appState.userProfile.goal === 'gain' ? 'selected' : ''}">
                    <input type="radio" name="goal" value="gain">
                    <span class="goal-name">Gain Weight</span>
                    <span class="goal-desc">Build muscle/mass</span>
                </label>
            </div>
            
            <button class="btn btn-primary btn-next" onclick="validateAndNext(5)">Continue →</button>
        </div>
        </div>
    `;
}

function renderStep6() {
    return `
        <div class="step-form">
            <h3>⚙️ Preferences & Restrictions</h3>
            <p class="step-description">Any allergies or restrictions? (Optional)</p>
            
            <div class="form-group">
                <label>Allergies (comma-separated)</label>
                <input type="text" id="allergies" placeholder="e.g., peanuts, shellfish, dairy" value="${appState.userProfile.allergies.join(', ')}">
            </div>
            
            <div class="form-group">
                <label>Intolerances (comma-separated)</label>
                <input type="text" id="intolerances" placeholder="e.g., gluten, lactose" value="${appState.userProfile.intolerances.join(', ')}">
            </div>
            
            <button class="btn btn-primary btn-next" onclick="validateAndNext(6)">Create My Plan →</button>
        </div>
        </div>
    `;
}

function validateAndNext(step) {
    const isValid = validateStep(step);
    if (isValid) {
        saveStepData(step);
        appState.onboardingStep++;
        renderOnboarding();
    }
}

function validateStep(step) {
    let isValid = true;
    
    switch(step) {
        case 1:
            const age = document.querySelector('#age').value;
            const gender = document.querySelector('input[name="gender"]:checked');
            if (!age || !gender) {
                alert('Please fill in all required fields');
                isValid = false;
            }
            break;
        case 2:
            const height = document.querySelector('#height').value;
            const weight = document.querySelector('#weight').value;
            if (!height || !weight) {
                alert('Please enter your height and weight');
                isValid = false;
            }
            break;
        case 3:
            const activity = document.querySelector('input[name="activity"]:checked');
            if (!activity) {
                alert('Please select an activity level');
                isValid = false;
            }
            break;
        case 4:
            const diet = document.querySelector('input[name="diet"]:checked');
            if (!diet) {
                alert('Please select a dietary preference');
                isValid = false;
            }
            break;
        case 5:
            const goal = document.querySelector('input[name="goal"]:checked');
            if (!goal) {
                alert('Please select a goal');
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

function saveStepData(step) {
    switch(step) {
        case 1:
            appState.userProfile.age = parseInt(document.querySelector('#age').value);
            appState.userProfile.gender = document.querySelector('input[name="gender"]:checked').value;
            break;
        case 2:
            appState.userProfile.height = parseInt(document.querySelector('#height').value);
            appState.userProfile.weight = parseFloat(document.querySelector('#weight').value);
            break;
        case 3:
            appState.userProfile.activity = document.querySelector('input[name="activity"]:checked').value;
            break;
        case 4:
            appState.userProfile.dietaryPreference = document.querySelector('input[name="diet"]:checked').value;
            break;
        case 5:
            appState.userProfile.goal = document.querySelector('input[name="goal"]:checked').value;
            break;
        case 6:
            const allergies = document.querySelector('#allergies').value;
            const intolerances = document.querySelector('#intolerances').value;
            appState.userProfile.allergies = allergies ? allergies.split(',').map(a => a.trim()) : [];
            appState.userProfile.intolerances = intolerances ? intolerances.split(',').map(i => i.trim()) : [];
            calculateNutrientTargets();
            generateMeals();
            break;
    }
}

function goBackStep() {
    if (appState.onboardingStep > 1) {
        appState.onboardingStep--;
        renderOnboarding();
    }
}

function attachStepListeners() {
    // Activity card selection
    document.querySelectorAll('.activity-card input').forEach(input => {
        input.addEventListener('change', function() {
            document.querySelectorAll('.activity-card').forEach(card => card.classList.remove('selected'));
            this.closest('.activity-card').classList.add('selected');
        });
    });
    
    // Diet card selection
    document.querySelectorAll('.diet-card input').forEach(input => {
        input.addEventListener('change', function() {
            document.querySelectorAll('.diet-card').forEach(card => card.classList.remove('selected'));
            this.closest('.diet-card').classList.add('selected');
        });
    });
    
    // Goal card selection
    document.querySelectorAll('.goal-card input').forEach(input => {
        input.addEventListener('change', function() {
            document.querySelectorAll('.goal-card').forEach(card => card.classList.remove('selected'));
            this.closest('.goal-card').classList.add('selected');
        });
    });
}

// ============================================================
// NUTRITIONAL CALCULATIONS
// ============================================================

function calculateNutrientTargets() {
    const { age, gender, height, weight, activity, goal } = appState.userProfile;
    
    // Harris-Benedict Formula for BMR
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // TDEE Calculation
    const activityFactors = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'extra-active': 1.9
    };
    
    const tdee = bmr * (activityFactors[activity] || 1.55);
    
    // Goal Adjustment
    let adjustedTdee = tdee;
    if (goal === 'lose') {
        adjustedTdee = tdee - 500; // 500 kcal deficit
    } else if (goal === 'gain') {
        adjustedTdee = tdee + 500; // 500 kcal surplus
    }
    
    // Macronutrient Distribution
    // Protein: 1.6-2.2g per kg (average 1.8g/kg for fitness)
    const protein = weight * 1.8;
    
    // Carbs: typically 45-65% of calories
    const carbPercentage = 0.50; // 50% of calories
    const carbs = (adjustedTdee * carbPercentage) / 4; // 4 kcal per gram
    
    // Fat: typically 20-35% of calories
    const fatPercentage = 0.30; // 30% of calories
    const fat = (adjustedTdee * fatPercentage) / 9; // 9 kcal per gram
    
    // Fiber: 30-38g per day depending on gender
    const fiber = gender === 'male' ? 38 : 25;
    
    appState.calculations = {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
        fiber: Math.round(fiber)
    };
}

// ============================================================
// MEAL RECOMMENDATIONS & ANALYSIS
// ============================================================

const foodDatabase = {
    proteins: {
        'non-veg': [
            { name: 'Chicken Breast', protein: 31, carbs: 0, fat: 3.6, fiber: 0, calories: 165, serving: '100g' },
            { name: 'Fish (Salmon)', protein: 25, carbs: 0, fat: 13, fiber: 0, calories: 208, serving: '100g' },
            { name: 'Egg', protein: 6, carbs: 0.6, fat: 5, fiber: 0, calories: 78, serving: '1 large' },
            { name: 'Beef', protein: 26, carbs: 0, fat: 11, fiber: 0, calories: 250, serving: '100g' }
        ],
        'vegetarian': [
            { name: 'Greek Yogurt', protein: 10, carbs: 7, fat: 5, fiber: 0, calories: 100, serving: '100g' },
            { name: 'Paneer', protein: 21, carbs: 3.2, fat: 20, fiber: 0, calories: 265, serving: '100g' },
            { name: 'Lentils (cooked)', protein: 9, carbs: 20, fat: 0.4, fiber: 8, calories: 116, serving: '1 cup' },
            { name: 'Milk', protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, calories: 60, serving: '100ml' }
        ],
        'vegan': [
            { name: 'Tofu', protein: 15, carbs: 2, fat: 9, fiber: 1.2, calories: 144, serving: '100g' },
            { name: 'Chickpeas (cooked)', protein: 12, carbs: 27, fat: 2.4, fiber: 8, calories: 164, serving: '1 cup' },
            { name: 'Soy Milk', protein: 3.3, carbs: 1.3, fat: 1.6, fiber: 0, calories: 33, serving: '100ml' },
            { name: 'Nuts (almonds)', protein: 21, carbs: 22, fat: 50, fiber: 13, calories: 579, serving: '100g' }
        ]
    },
    carbs: [
        { name: 'Brown Rice', protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, calories: 112, serving: '100g' },
        { name: 'Whole Wheat Bread', protein: 4.2, carbs: 44, fat: 1, fiber: 7, calories: 218, serving: '2 slices' },
        { name: 'Oats', protein: 10, carbs: 54, fat: 5, fiber: 8, calories: 389, serving: '100g' },
        { name: 'Sweet Potato', protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, calories: 86, serving: '100g' }
    ],
    vegetables: [
        { name: 'Spinach', protein: 3, carbs: 4, fat: 0.4, fiber: 2, calories: 23, serving: '100g' },
        { name: 'Broccoli', protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.4, calories: 34, serving: '100g' },
        { name: 'Carrot', protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, calories: 41, serving: '100g' },
        { name: 'Tomato', protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, calories: 18, serving: '100g' }
    ]
};

function generateMeals() {
    appState.meals = [];
    
    const { dietaryPreference, goal } = appState.userProfile;
    const { protein, carbs, fat, calories } = appState.calculations;
    
    // Generate meals focusing on macro targets
    const breakfastCalories = calories * 0.25;
    const lunchCalories = calories * 0.35;
    const dinnerCalories = calories * 0.30;
    
    appState.meals.push(
        generateMeal('breakfast', breakfastCalories, dietaryPreference),
        generateMeal('lunch', lunchCalories, dietaryPreference),
        generateMeal('dinner', dinnerCalories, dietaryPreference)
    );
    
    analyzeMeals();
}

function generateMeal(mealType, targetCalories, dietaryPreference) {
    const foods = [];
    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    // Simplified meal generation
    if (mealType === 'breakfast') {
        const proteinSource = foodDatabase.proteins[dietaryPreference][0];
        const carbSource = foodDatabase.carbs[2]; // Oats
        const veggie = foodDatabase.vegetables[0];
        
        foods.push(proteinSource, carbSource, veggie);
        totalNutrition = {
            calories: proteinSource.calories * 0.8 + carbSource.calories * 0.5 + veggie.calories * 0.5,
            protein: proteinSource.protein * 0.8 + veggie.protein * 0.5,
            carbs: carbSource.carbs * 0.5 + veggie.carbs * 0.5,
            fat: proteinSource.fat * 0.8 + carbSource.fat * 0.5,
            fiber: carbSource.fiber * 0.5 + veggie.fiber * 0.5
        };
    } else if (mealType === 'lunch') {
        const proteinSource = foodDatabase.proteins[dietaryPreference][1];
        const carbSource = foodDatabase.carbs[0]; // Brown rice
        const veggie = foodDatabase.vegetables[1];
        
        foods.push(proteinSource, carbSource, veggie);
        totalNutrition = {
            calories: proteinSource.calories + carbSource.calories + veggie.calories * 0.8,
            protein: proteinSource.protein + veggie.protein * 0.8,
            carbs: carbSource.carbs + veggie.carbs * 0.8,
            fat: proteinSource.fat + carbSource.fat,
            fiber: carbSource.fiber + veggie.fiber * 0.8
        };
    } else {
        const proteinSource = foodDatabase.proteins[dietaryPreference][2];
        const carbSource = foodDatabase.carbs[1]; // Whole wheat
        const veggie = foodDatabase.vegetables[2];
        
        foods.push(proteinSource, carbSource, veggie);
        totalNutrition = {
            calories: proteinSource.calories + carbSource.calories * 0.5 + veggie.calories * 1.5,
            protein: proteinSource.protein + veggie.protein * 1.5,
            carbs: carbSource.carbs * 0.5 + veggie.carbs * 1.5,
            fat: proteinSource.fat + carbSource.fat * 0.5,
            fiber: carbSource.fiber * 0.5 + veggie.fiber * 1.5
        };
    }
    
    return {
        type: mealType,
        name: getMealName(mealType),
        foods: foods,
        nutrition: totalNutrition,
        emoji: getMealEmoji(mealType)
    };
}

function getMealName(type) {
    const names = {
        'breakfast': 'Protein-Rich Breakfast',
        'lunch': 'Balanced Lunch Bowl',
        'dinner': 'Nourishing Dinner'
    };
    return names[type] || type;
}

function getMealEmoji(type) {
    const emojis = {
        'breakfast': '🍳',
        'lunch': '🍲',
        'dinner': '🍽'
    };
    return emojis[type] || '🥘';
}

function analyzeMeals() {
    appState.mealAnalysis = appState.meals.map(meal => {
        const analysis = {
            meal: meal,
            strengths: [],
            limitations: [],
            suggestions: []
        };
        
        // Analyze macros
        if (meal.nutrition.protein > appState.calculations.protein * 0.25) {
            analysis.strengths.push('Good protein content');
        } else {
            analysis.limitations.push('Could benefit from more protein');
            analysis.suggestions.push('Add an extra protein source');
        }
        
        if (meal.nutrition.fiber > 5) {
            analysis.strengths.push('High in fiber');
        } else {
            analysis.limitations.push('Low fiber content');
            analysis.suggestions.push('Include more vegetables or whole grains');
        }
        
        return analysis;
    });
}

// ============================================================
// DASHBOARD RENDERING
// ============================================================

function renderDashboard() {
    const container = document.querySelector('#appContainer');
    
    let html = `
        <div class="dashboard">
            <div class="dashboard-header">
                <div class="greeting">
                    <h1>Welcome! 👋</h1>
                    <p>Your personalized nutrition plan is ready.</p>
                </div>
                <div class="dashboard-actions">
                    <button class="btn btn-sm" onclick="editProfile()">Edit Profile</button>
                    <button class="btn btn-sm" onclick="downloadPlan()">Download Plan</button>
                </div>
            </div>
            
            ${renderDailyTargets()}
            ${renderMealCards()}
            ${renderNutritionDashboard()}
            ${renderDeficiencyLink()}
            ${renderDisclaimer()}
        </div>
    `;
    
    container.innerHTML = html;
    attachDashboardListeners();
}

function renderDailyTargets() {
    const { calories, protein, carbs, fat, fiber } = appState.calculations;
    
    return `
        <section class="nutrition-targets">
            <h2>Your Daily Targets</h2>
            <div class="target-cards">
                <div class="target-card">
                    <div class="target-label">Calories</div>
                    <div class="target-value">${calories}</div>
                    <div class="target-unit">kcal</div>
                </div>
                <div class="target-card">
                    <div class="target-label">Protein</div>
                    <div class="target-value">${protein}</div>
                    <div class="target-unit">g</div>
                </div>
                <div class="target-card">
                    <div class="target-label">Carbs</div>
                    <div class="target-value">${carbs}</div>
                    <div class="target-unit">g</div>
                </div>
                <div class="target-card">
                    <div class="target-label">Fat</div>
                    <div class="target-value">${fat}</div>
                    <div class="target-unit">g</div>
                </div>
                <div class="target-card">
                    <div class="target-label">Fiber</div>
                    <div class="target-value">${fiber}</div>
                    <div class="target-unit">g</div>
                </div>
            </div>
        </section>
    `;
}

function renderMealCards() {
    return `
        <section class="meals-section">
            <h2>Your Personalized Meals</h2>
            <div class="meals-container">
                ${appState.meals.map((meal, index) => `
                    <div class="meal-card" onclick="expandMeal(${index})">
                        <div class="meal-header">
                            <h3>${meal.emoji} ${meal.name}</h3>
                            <span class="meal-type">${meal.type}</span>
                        </div>
                        <div class="meal-nutrition-summary">
                            <span>🔥 ${Math.round(meal.nutrition.calories)} kcal</span>
                            <span>💪 ${Math.round(meal.nutrition.protein)}g protein</span>
                            <span>🌾 ${Math.round(meal.nutrition.fiber)}g fiber</span>
                        </div>
                        <button class="btn btn-sm">View Details →</button>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

function renderNutritionDashboard() {
    const totalNutrition = appState.meals.reduce((acc, meal) => ({
        calories: acc.calories + meal.nutrition.calories,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fat: acc.fat + meal.nutrition.fat,
        fiber: acc.fiber + meal.nutrition.fiber
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    
    return `
        <section class="nutrition-dashboard">
            <h2>Daily Nutrition Overview</h2>
            <div class="nutrition-bars">
                ${renderNutritionBar('Calories', totalNutrition.calories, appState.calculations.calories, 'kcal')}
                ${renderNutritionBar('Protein', totalNutrition.protein, appState.calculations.protein, 'g')}
                ${renderNutritionBar('Carbs', totalNutrition.carbs, appState.calculations.carbs, 'g')}
                ${renderNutritionBar('Fat', totalNutrition.fat, appState.calculations.fat, 'g')}
                ${renderNutritionBar('Fiber', totalNutrition.fiber, appState.calculations.fiber, 'g')}
            </div>
        </section>
    `;
}

function renderNutritionBar(label, actual, target, unit) {
    const percentage = Math.min((actual / target) * 100, 100);
    
    return `
        <div class="nutrition-bar-item">
            <div class="bar-header">
                <span class="bar-label">${label}</span>
                <span class="bar-values">${Math.round(actual)} / ${target} ${unit}</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${percentage}%"></div>
            </div>
        </div>
    `;
}

function renderDeficiencyLink() {
    return `
        <section class="deficiency-section">
            <div class="deficiency-card">
                <div class="deficiency-icon">🧬</div>
                <div class="deficiency-content">
                    <h3>Nutrient Status Check</h3>
                    <p>Screen your dietary pattern for potential nutrient inadequacies including vitamins and minerals.</p>
                    <button class="btn btn-primary" onclick="goToDeficiencyCheck()">Check Nutrient Status</button>
                </div>
            </div>
        </section>
    `;
}

function renderDisclaimer() {
    return `
        <section class="disclaimer-section">
            <div class="disclaimer-content">
                <h3>⚕️ Important Disclaimer</h3>
                <p>NutriSynth provides evidence-based general nutrition information and personalized dietary guidance based on the information provided. It does not diagnose medical conditions or confirm nutrient deficiencies. Nutritional needs can vary with health conditions, medications, allergies, laboratory findings, and other factors. <strong>Consult a qualified healthcare professional when appropriate.</strong></p>
            </div>
        </section>
    `;
}

function expandMeal(index) {
    const meal = appState.meals[index];
    const analysis = appState.mealAnalysis[index];
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <h2>${meal.emoji} ${meal.name}</h2>
            
            <div class="meal-details">
                <h3>Foods in this meal</h3>
                <ul>
                    ${meal.foods.map(food => `<li>${food.name}</li>`).join('')}
                </ul>
            </div>
            
            <div class="meal-nutrition-details">
                <h3>Nutrition Information</h3>
                <div class="nutrition-grid">
                    <div>Calories: ${Math.round(meal.nutrition.calories)}</div>
                    <div>Protein: ${Math.round(meal.nutrition.protein)}g</div>
                    <div>Carbs: ${Math.round(meal.nutrition.carbs)}g</div>
                    <div>Fat: ${Math.round(meal.nutrition.fat)}g</div>
                    <div>Fiber: ${Math.round(meal.nutrition.fiber)}g</div>
                </div>
            </div>
            
            <div class="meal-analysis">
                <h3>💡 Why This Meal</h3>
                <p>This meal is tailored to your preferences and nutritional targets based on your ${appState.userProfile.dietaryPreference} diet and your goal to ${appState.userProfile.goal} weight.</p>
            </div>
            
            ${analysis.limitations.length > 0 ? `
                <div class="meal-analysis warning">
                    <h3>⚠️ Potential Improvements</h3>
                    <ul>
                        ${analysis.limitations.map(l => `<li>${l}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${analysis.suggestions.length > 0 ? `
                <div class="meal-analysis suggestion">
                    <h3>✨ Suggestions</h3>
                    <ul>
                        ${analysis.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function goToDeficiencyCheck() {
    window.location.href = 'deficiency-check.html';
}

function editProfile() {
    appState.onboardingStep = 1;
    renderOnboarding();
}

function downloadPlan() {
    alert('Plan download feature coming soon!');
}

function attachDashboardListeners() {
    // Attach any dynamic listeners
}

// ============================================================
// INITIALIZATION ON PAGE LOAD
// ============================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEventListeners);
} else {
    initializeEventListeners();
}
