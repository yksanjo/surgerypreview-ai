// SurgeryPreview AI Integration
// This module provides AI-powered features for surgical analysis

import OpenAI from 'openai';

class SurgeryPreviewAI {
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey
        });
        this.costPerImage = 0.02; // $0.02 per image analysis
        this.chargePerAnalysis = 3.00; // Charge $3 per analysis
    }

    /**
     * Analyze a photo for plastic surgery consultation
     * @param {Buffer} imageBuffer - Image buffer
     * @param {string} procedure - Desired procedure
     * @param {Object} patientInfo - Patient information
     * @returns {Promise<Object>} Analysis results
     */
    async analyzePhoto(imageBuffer, procedure, patientInfo = {}) {
        try {
            const base64Image = imageBuffer.toString('base64');
            
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o", // GPT-4 Omni with vision
                messages: [
                    {
                        role: "system",
                        content: `You are a professional plastic surgery consultant. 
                        Analyze photos and provide educational, non-diagnostic information.
                        Always include disclaimers about consulting with board-certified surgeons.
                        Be professional, empathetic, and educational.`
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Analyze this photo for a ${procedure} consultation.

                                Patient Information:
                                - Age: ${patientInfo.age || 'Not specified'}
                                - Gender: ${patientInfo.gender || 'Not specified'}
                                - Concerns: ${patientInfo.concerns || 'Not specified'}

                                Please provide:
                                1. Facial/Body Analysis: Describe relevant anatomical features
                                2. Procedure Suitability: General suitability for ${procedure}
                                3. Expected Outcomes: What patients can typically expect
                                4. Consultation Questions: Questions to ask surgeons
                                5. Important Considerations: Risks and limitations

                                Format response as JSON with these keys:
                                - analysis: string (detailed analysis)
                                - suitability: "Good" | "Fair" | "Complex" | "Consult Required"
                                - keyPoints: array of strings (3-5 key points)
                                - questionsForSurgeon: array of strings (5-10 questions)
                                - disclaimer: string (medical disclaimer)

                                Keep it educational, not diagnostic.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            const analysis = JSON.parse(response.choices[0].message.content);
            
            // Add metadata
            analysis.metadata = {
                procedure: procedure,
                analysisId: this.generateAnalysisId(),
                timestamp: new Date().toISOString(),
                cost: this.costPerImage,
                charge: this.chargePerAnalysis,
                model: "gpt-4o"
            };

            return analysis;

        } catch (error) {
            console.error('AI analysis error:', error);
            throw new Error('Failed to analyze image');
        }
    }

    /**
     * Generate surgeon recommendations based on patient profile
     * @param {Object} patientProfile - Patient profile
     * @param {Array} surgeons - List of surgeons
     * @returns {Promise<Array>} Ranked surgeon recommendations
     */
    async recommendSurgeons(patientProfile, surgeons) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are a surgeon matching expert. 
                        Match patients with surgeons based on:
                        1. Procedure specialty match
                        2. Location proximity
                        3. Patient preferences
                        4. Surgeon ratings and experience
                        5. Price range compatibility`
                    },
                    {
                        role: "user",
                        content: `Match this patient with surgeons:

                        Patient Profile:
                        - Procedure: ${patientProfile.procedure}
                        - Location: ${patientProfile.location}
                        - Budget: ${patientProfile.budget || 'Not specified'}
                        - Timeline: ${patientProfile.timeline || 'Not specified'}
                        - Age: ${patientProfile.age || 'Not specified'}
                        - Gender: ${patientProfile.gender || 'Not specified'}
                        - Concerns: ${patientProfile.concerns || 'Not specified'}

                        Available Surgeons: ${JSON.stringify(surgeons.slice(0, 10))}

                        Return top 3 matches with:
                        - matchScore: 0-100
                        - reasoning: string
                        - strengths: array of strings
                        - considerations: array of strings

                        Format as JSON array.`
                    }
                ],
                max_tokens: 1000,
                temperature: 0.5,
                response_format: { type: "json_object" }
            });

            return JSON.parse(response.choices[0].message.content);

        } catch (error) {
            console.error('Surgeon recommendation error:', error);
            // Fall back to simple matching
            return this.simpleSurgeonMatch(patientProfile, surgeons);
        }
    }

    /**
     * Simple matching algorithm (fallback)
     */
    simpleSurgeonMatch(patientProfile, surgeons) {
        return surgeons
            .filter(surgeon => 
                surgeon.specialties.includes(patientProfile.procedure) &&
                surgeon.location === patientProfile.location
            )
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map((surgeon, index) => ({
                surgeonId: surgeon.id,
                name: surgeon.name,
                matchScore: 100 - (index * 20),
                reasoning: `Matches procedure and location, ${surgeon.rating} star rating`,
                strengths: [
                    `Specializes in ${patientProfile.procedure}`,
                    `Located in ${patientProfile.location}`,
                    `${surgeon.rating} star rating with ${surgeon.reviewCount} reviews`
                ],
                considerations: [
                    'Schedule consultation to discuss specific needs',
                    'Verify availability for desired timeline',
                    'Discuss pricing during consultation'
                ]
            }));
    }

    /**
     * Generate consultation questions based on procedure
     * @param {string} procedure - Surgical procedure
     * @returns {Promise<Array>} List of questions
     */
    async generateConsultationQuestions(procedure) {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `Generate thoughtful consultation questions for plastic surgery.
                        Questions should help patients make informed decisions.
                        Include questions about experience, technique, recovery, and risks.`
                    },
                    {
                        role: "user",
                        content: `Generate 10 consultation questions for ${procedure}.
                        Include questions about:
                        1. Surgeon's experience and credentials
                        2. Surgical technique and approach
                        3. Expected recovery process
                        4. Potential risks and complications
                        5. Before/after care
                        6. Cost and financing
                        7. Realistic expectations

                        Return as JSON array of strings.`
                    }
                ],
                max_tokens: 800,
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            return JSON.parse(response.choices[0].message.content);

        } catch (error) {
            console.error('Question generation error:', error);
            return this.defaultQuestions(procedure);
        }
    }

    /**
     * Default questions (fallback)
     */
    defaultQuestions(procedure) {
        return [
            `How many ${procedure} procedures do you perform annually?`,
            'What is your board certification status?',
            'Can I see before/after photos of similar cases?',
            'What surgical technique do you recommend for me?',
            'What are the potential risks and complications?',
            'What is the expected recovery timeline?',
            'What kind of follow-up care is included?',
            'What is the total cost including all fees?',
            'Do you offer financing options?',
            'What are realistic expectations for results?'
        ];
    }

    /**
     * Generate analysis ID
     */
    generateAnalysisId() {
        return `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Calculate cost for analysis
     */
    calculateCost(analysisCount) {
        return {
            cost: analysisCount * this.costPerImage,
            revenue: analysisCount * this.chargePerAnalysis,
            profit: analysisCount * (this.chargePerAnalysis - this.costPerImage),
            margin: ((this.chargePerAnalysis - this.costPerImage) / this.chargePerAnalysis * 100).toFixed(2)
        };
    }
}

// Example usage
/*
const ai = new SurgeryPreviewAI(process.env.OPENAI_API_KEY);

// Analyze photo
const analysis = await ai.analyzePhoto(
    imageBuffer,
    'rhinoplasty',
    { age: 28, gender: 'female', concerns: 'nasal bridge refinement' }
);

// Recommend surgeons
const recommendations = await ai.recommendSurgeons(
    { procedure: 'rhinoplasty', location: 'NYC-Manhattan' },
    surgeonsList
);

// Generate questions
const questions = await ai.generateConsultationQuestions('rhinoplasty');
*/

export default SurgeryPreviewAI;