/* ============================================================
   NUTRISYNTH DEFICIENCY CHECK
   ============================================================ */

const deficiencyState = {
    step: 1,
    userInfo: {
        age: null,
        gender: null,
        dietaryPattern: null,
        dietaryPreference: null
    },
    laboratoryData: {},
    screeningResults: {}
};

// Reference values for nutrient adequacy
const nutrientReferenceValues = {
    'vitamin-b12': {
        name: 'Vitamin B12',
        unit: 'µg',
        recommended: { all: 2.4 },
        dietarySourcesRisk: {
            vegan: 'high',
            vegetarian: 'moderate',
            'non-veg': 'low'
        },
        evidenceSources: ['NIH Office of Dietary Supplements', 'National Academies']
    },
    'vitamin-d': {
        name: 'Vitamin D',
        unit: 'IU',
        recommended: { all: 1000 },
        dietarySourcesRisk: { all: 'moderate' },
        evidenceSources: ['NIH Office of Dietary Supplements', 'Endocrine Society']
    },
    'iron': {
        name: 'Iron',
        unit: 'mg',
        recommended: { male: 8, female: 18 },
        dietarySourcesRisk: {
            vegan: 'high',
            vegetarian: 'moderate',
            'non-veg': 'low'
        },
        evidenceSources: ['National Academies', 'WHO Guidelines']
    },
    'calcium': {
        name: 'Calcium',
        unit: 'mg',
        recommended: { all: 1000 },
        dietarySourcesRisk: {
            vegan: 'high',
            vegetarian: 'low',
            'non-veg': 'low'
        },
        evidenceSources: ['National Academies', 'USDA Guidelines']
    },
    'zinc': {
        name: 'Zinc',
        unit: 'mg',
        recommended: { male: 11, female: 8 },
        dietarySourcesRisk: {
            vegan: 'high',
            vegetarian: 'moderate',
            'non-veg': 'low'
        },
        evidenceSources: ['National Academies', 'NIH']
    },
    'folate': {
        name: 'Folate',
        unit: 'µg',
        recommended: { all: 400 },
        dietarySourcesRisk: {
            vegan: 'moderate',
            vegetarian: 'low',
            'non-veg': 'low'
        },
        evidenceSources: ['National Academies', 'CDC']
    },
    'vitamin-a': {
        name: 'Vitamin A',
        unit: 'µg',
        recommended: { male: 900, female: 700 },
        dietarySourcesRisk: { all: 'low' },
        evidenceSources: ['National Academies']
    },
    'vitamin-c': {
        name: 'Vitamin C',
        unit: 'mg',
        recommended: { male: 90, female: 75 },
        dietarySourcesRisk: { all: 'low' },
        evidenceSources: ['National Academies']
    },
    'vitamin-e': {
        name: 'Vitamin E',
        unit: 'mg',
        recommended: { all: 15 },
        dietarySourcesRisk: { all: 'low' },
        evidenceSources: ['National Academies', 'NIH']
    },
    'vitamin-k': {
        name: 'Vitamin K',
        unit: 'µg',
        recommended: { male: 120, female: 90 },
        dietarySourcesRisk: { all: 'low' },
        evidenceSources: ['National Academies']
    },
    'magnesium': {
        name: 'Magnesium',
        unit: 'mg',
        recommended: { male: 400, female: 310 },
        dietarySourcesRisk: { all: 'moderate' },
        evidenceSources: ['National Academies']
    },
    'iodine': {
        name: 'Iodine',
        unit: 'µg',
        recommended: { all: 150 },
        dietarySourcesRisk: { all: 'moderate' },
        evidenceSources: ['WHO', 'NIH Office of Dietary Supplements']
    },
    'selenium': {
        name: 'Selenium',
        unit: 'µg',
        recommended: { all: 55 },
        dietarySourcesRisk: { all: 'low' },
        evidenceSources: ['National Academies']
    },
    'potassium': {
        name: 'Potassium',
        unit: 'mg',
        recommended: { male: 3400, female: 2600 },
        dietarySourcesRisk: { all: 'low' },
        evidenceSources: ['National Academies', 'WHO']
    },
    'protein': {
        name: 'Protein',
        unit: 'g/kg',
        recommended: { all: 0.8 },
        dietarySourcesRisk: {
            vegan: 'moderate',
            vegetarian: 'low',
            'non-veg': 'low'
        },
        evidenceSources: ['National Academies', 'ICMR']
    },
    'fiber': {
        name: 'Dietary Fiber',
        unit: 'g',
        recommended: { male: 38, female: 25 },
        dietarySourcesRisk: { all: 'low' },
        evidenceSources: ['National Academies', 'WHO']
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    renderDeficiencyScreen();
});

function renderDeficiencyScreen() {
    const step = deficiencyState.step;
    const container = document.querySelector('#deficiencyContainer');
    
    if (step === 1) {
        renderIntroduction();
    } else if (step === 2) {
        renderNutrientScreening();
    } else if (step === 3) {
        renderLabResultsOptional();
    } else if (step === 4) {
        renderResults();
    }
}

function renderIntroduction() {
    const html = `
        <div class="deficiency-intro">
            <div class="container">
                <div class="intro-card">
                    <h1>🧬 NutriSynth Nutrient Status Check</h1>
                    <p class="intro-subtitle">Screen your dietary pattern for potential nutrient inadequacies</p>
                    
                    <div class="intro-info">
                        <div class="info-card">
                            <h3>What This Tool Does</h3>
                            <p>This screening tool helps identify nutrients that may be inadequately consumed based on your dietary pattern, age, and gender. It uses evidence-based reference values from recognized health organizations.</p>
                        </div>
                        
                        <div class="info-card">
                            <h3>Important Note</h3>
                            <p><strong>This is not medical diagnosis.</strong> Low dietary intake doesn't confirm deficiency. Your actual nutrient status depends on absorption, health conditions, medications, and other factors. Lab results provide the most accurate assessment.</p>
                        </div>
                        
                        <div class="info-card">
                            <h3>How It Works</h3>
                            <ol>
                                <li>Answer questions about your age, gender, and diet</li>
                                <li>Receive screening results for 16 key nutrients</li>
                                <li>Optional: Enter lab results for more accurate assessment</li>
                                <li>Get evidence-based interpretation</li>
                            </ol>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary btn-lg" onclick="goToStep(2)">Start Screening</button>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('#deficiencyContainer').innerHTML = html;
}

function renderNutrientScreening() {
    const html = `
        <div class="screening-page">
            <div class="container">
                <div class="screening-form">
                    <h2>Tell us about your diet</h2>
                    <p class="form-description">This information helps us screen for nutrients you may need to pay attention to.</p>
                    
                    <div class="form-group">
                        <label>Age (years)</label>
                        <input type="number" id="age" min="1" max="150" placeholder="e.g., 30" value="${deficiencyState.userInfo.age || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>Gender</label>
                        <div class="option-group">
                            <label class="option-label">
                                <input type="radio" name="gender" value="male" ${deficiencyState.userInfo.gender === 'male' ? 'checked' : ''}>
                                <span>Male</span>
                            </label>
                            <label class="option-label">
                                <input type="radio" name="gender" value="female" ${deficiencyState.userInfo.gender === 'female' ? 'checked' : ''}>
                                <span>Female</span>
                            </label>
                            <label class="option-label">
                                <input type="radio" name="gender" value="other" ${deficiencyState.userInfo.gender === 'other' ? 'checked' : ''}>
                                <span>Other</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Dietary Preference</label>
                        <div class="option-group">
                            <label class="option-label">
                                <input type="radio" name="diet" value="non-veg" ${deficiencyState.userInfo.dietaryPreference === 'non-veg' ? 'checked' : ''}>
                                <span>Non-Vegetarian</span>
                            </label>
                            <label class="option-label">
                                <input type="radio" name="diet" value="vegetarian" ${deficiencyState.userInfo.dietaryPreference === 'vegetarian' ? 'checked' : ''}>
                                <span>Vegetarian</span>
                            </label>
                            <label class="option-label">
                                <input type="radio" name="diet" value="vegan" ${deficiencyState.userInfo.dietaryPreference === 'vegan' ? 'checked' : ''}>
                                <span>Vegan</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="goToStep(1)">← Back</button>
                        <button class="btn btn-primary" onclick="saveScreeningInfo()">Continue →</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('#deficiencyContainer').innerHTML = html;
}

function renderLabResultsOptional() {
    const html = `
        <div class="lab-results-page">
            <div class="container">
                <div class="lab-form">
                    <h2>🧪 Optional Lab Results</h2>
                    <p class="form-description">If you have recent lab results, you can enter them here for more accurate nutrient status assessment.</p>
                    
                    <div class="lab-info-card">
                        <p><strong>Note:</strong> Without lab results, we'll provide screening based on dietary patterns. Lab data gives a complete picture of your actual nutrient status.</p>
                    </div>
                    
                    <div id="labInputs" class="lab-inputs-container">
                        <!-- Lab input fields will be generated here -->
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="goToStep(2)">← Back</button>
                        <button class="btn btn-primary" onclick="processResults()">View Results →</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('#deficiencyContainer').innerHTML = html;
    renderLabInputs();
}

function renderLabInputs() {
    const nutrients = Object.keys(nutrientReferenceValues);
    let inputsHtml = '';
    
    inputsHtml += `
        <div class="lab-section">
            <h3>Nutrient Lab Values (Optional)</h3>
            <p class="lab-section-desc">Enter any lab test values you have. Leave blank if not tested.</p>
            
            <div class="lab-grid">
    `;
    
    nutrients.forEach(nutrientKey => {
        const nutrient = nutrientReferenceValues[nutrientKey];
        inputsHtml += `
            <div class="lab-input-group">
                <label>${nutrient.name}</label>
                <div class="lab-input-wrapper">
                    <input type="number" step="0.1" placeholder="Value" class="lab-value" data-nutrient="${nutrientKey}">
                    <span class="lab-unit">${nutrient.unit}</span>
                </div>
                <input type="text" placeholder="Lab range (e.g., 200-900)" class="lab-range" data-nutrient="${nutrientKey}">
            </div>
        `;
    });
    
    inputsHtml += `
            </div>
        </div>
    `;
    
    document.querySelector('#labInputs').innerHTML = inputsHtml;
}

function saveScreeningInfo() {
    const age = document.querySelector('#age').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const diet = document.querySelector('input[name="diet"]:checked')?.value;
    
    if (!age || !gender || !diet) {
        alert('Please fill in all required fields');
        return;
    }
    
    deficiencyState.userInfo.age = parseInt(age);
    deficiencyState.userInfo.gender = gender;
    deficiencyState.userInfo.dietaryPreference = diet;
    
    goToStep(3);
}

function processResults() {
    // Collect lab data
    document.querySelectorAll('.lab-value').forEach(input => {
        const nutrient = input.getAttribute('data-nutrient');
        const value = input.value;
        if (value) {
            deficiencyState.laboratororyData[nutrient] = {
                value: parseFloat(value),
                range: document.querySelector(`.lab-range[data-nutrient="${nutrient}"]`).value
            };
        }
    });
    
    // Process screening results
    processScreeningResults();
    goToStep(4);
}

function processScreeningResults() {
    const { age, gender, dietaryPreference } = deficiencyState.userInfo;
    deficiencyState.screeningResults = {};
    
    Object.entries(nutrientReferenceValues).forEach(([key, nutrient]) => {
        const riskLevel = nutrient.dietarySourcesRisk[dietaryPreference] || nutrient.dietarySourcesRisk.all;
        const recommended = nutrient.recommended[gender] || nutrient.recommended.all;
        
        let status = '🔵'; // Insufficient data by default
        let statusLabel = 'Insufficient data';
        
        if (deficiencyState.laboratororyData[key]) {
            const labData = deficiencyState.laboratororyData[key];
            // Would need to parse the range and compare
            status = '📚'; // Lab data provided
            statusLabel = 'Lab result provided';
        } else {
            // Dietary risk assessment
            if (riskLevel === 'high') {
                status = '🟠';
                statusLabel = 'Attention needed';
            } else if (riskLevel === 'moderate') {
                status = '🟡';
                statusLabel = 'Potential low intake';
            } else {
                status = '🟢';
                statusLabel = 'Target appears met';
            }
        }
        
        deficiencyState.screeningResults[key] = {
            nutrient: nutrient.name,
            unit: nutrient.unit,
            recommended: recommended,
            status: status,
            statusLabel: statusLabel,
            riskLevel: riskLevel,
            sources: nutrient.evidenceSources
        };
    });
}

function renderResults() {
    const html = `
        <div class="results-page">
            <div class="container">
                <h2>🧬 Your Nutrient Status Screening</h2>
                <p class="results-subtitle">Based on your dietary pattern and age</p>
                
                <div class="status-legend">
                    <div class="legend-item"><span>🟢</span> Target appears met</div>
                    <div class="legend-item"><span>🟡</span> Potential low intake</div>
                    <div class="legend-item"><span>🟠</span> Attention needed</div>
                    <div class="legend-item"><span>🔴</span> Professional review</div>
                    <div class="legend-item"><span>🔵</span> Insufficient data</div>
                    <div class="legend-item"><span>📚</span> Lab result provided</div>
                </div>
                
                <div class="results-grid">
                    ${Object.entries(deficiencyState.screeningResults).map(([key, result]) => `
                        <div class="result-card">
                            <div class="result-header">
                                <h3>${result.status} ${result.nutrient}</h3>
                                <span class="result-unit">${result.unit}</span>
                            </div>
                            <div class="result-body">
                                <div class="result-status">${result.statusLabel}</div>
                                <div class="result-recommended">Recommended: ${result.recommended} ${result.unit}</div>
                            </div>
                            <button class="result-expand-btn" onclick="toggleResultDetails('${key}')">Details ↓</button>
                            <div class="result-details hidden" id="details-${key}">
                                <p>Dietary pattern risk: <strong>${result.riskLevel}</strong></p>
                                <p class="evidence-sources">📚 Evidence basis: ${result.sources.join(', ')}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="results-info">
                    <h3>How to Use These Results</h3>
                    <div class="info-boxes">
                        <div class="info-box">
                            <h4>🟢 Target Appears Met</h4>
                            <p>Your dietary pattern typically provides adequate intake. Continue current habits.</p>
                        </div>
                        <div class="info-box">
                            <h4>🟡 Potential Low Intake</h4>
                            <p>Consider food sources rich in this nutrient or discuss supplementation with a professional.</p>
                        </div>
                        <div class="info-box">
                            <h4>🟠 Attention Needed</h4>
                            <p>Your dietary pattern has elevated risk. Increase food sources or consider supplementation.</p>
                        </div>
                    </div>
                </div>
                
                ${renderDisclaimer()}
                
                <div class="results-actions">
                    <button class="btn btn-secondary" onclick="goToStep(1)">← Start Over</button>
                    <button class="btn btn-primary" onclick="goBack()">← Back to Dashboard</button>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('#deficiencyContainer').innerHTML = html;
}

function renderDisclaimer() {
    return `
        <div class="disclaimer-section">
            <div class="disclaimer-content">
                <h3>⚕️ Important Information</h3>
                <p>This screening identifies nutrients at risk based on dietary patterns and age-based recommendations from established health organizations. It does <strong>not</strong> diagnose deficiencies or medical conditions. Nutrient deficiency depends on multiple factors including absorption, health conditions, medications, and individual variation. <strong>Professional laboratory testing and consultation with a healthcare provider gives the most accurate assessment of your nutrient status.</strong></p>
            </div>
        </div>
    `;
}

function toggleResultDetails(key) {
    const details = document.querySelector(`#details-${key}`);
    details.classList.toggle('hidden');
}

function goToStep(step) {
    deficiencyState.step = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderDeficiencyScreen();
}

function goBack() {
    window.location.href = 'index.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // renderDeficiencyScreen() is called from the main script
});
