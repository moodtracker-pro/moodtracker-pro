// 365 Daily Wellness Tips Generator
const WELLNESS_CATEGORIES = {
    mindfulness: {
        icon: 'fas fa-brain',
        tips: [
            'Practice gratitude by writing down 3 things you\'re thankful for today.',
            'Spend 5 minutes in silent meditation focusing on your breath.',
            'Practice mindful eating by savoring each bite of your meal.',
            'Take a mindful walk, noticing colors, sounds, and sensations.',
            'Practice the 5-4-3-2-1 grounding technique when feeling anxious.',
            'Do a body scan meditation before bed.',
            'Practice loving-kindness meditation for 10 minutes.',
            'Mindfully observe your thoughts without judgment for 5 minutes.',
            'Practice mindful listening during conversations today.',
            'Take three conscious breaths before responding to stress.',
            'Practice present-moment awareness while doing routine tasks.',
            'Meditate on a positive intention for the day.',
            'Practice mindful breathing during transitions between activities.',
            'Observe nature mindfully for 10 minutes.',
            'Practice acceptance of one challenging situation today.'
        ]
    },
    exercise: {
        icon: 'fas fa-dumbbell',
        tips: [
            'Take a 10-minute walk outside. Nature and movement are powerful mood boosters.',
            'Do 10 jumping jacks to get your blood flowing.',
            'Try a 5-minute yoga flow to stretch and strengthen.',
            'Dance to your favorite song for instant mood elevation.',
            'Do wall push-ups during a work break.',
            'Take the stairs instead of the elevator today.',
            'Try a 7-minute high-intensity workout.',
            'Do desk stretches every hour if you work at a computer.',
            'Practice balance by standing on one foot for 30 seconds.',
            'Do squats while brushing your teeth.',
            'Try a new physical activity or sport.',
            'Walk or bike instead of driving for short distances.',
            'Do planks during TV commercial breaks.',
            'Stretch for 10 minutes before bed.',
            'Try swimming or water aerobics for low-impact exercise.'
        ]
    },
    nutrition: {
        icon: 'fas fa-apple-alt',
        tips: [
            'Eat a nutritious meal with colorful fruits and vegetables.',
            'Try a new healthy recipe today.',
            'Eat mindfully without distractions for one meal.',
            'Include omega-3 rich foods like salmon or walnuts.',
            'Prepare a healthy snack to avoid processed options.',
            'Eat the rainbow - include 5 different colored foods.',
            'Try intermittent fasting with a 12-hour eating window.',
            'Reduce sugar intake by choosing whole fruits over sweets.',
            'Include probiotic foods like yogurt or kefir.',
            'Meal prep healthy options for the week.',
            'Try plant-based proteins like beans or quinoa.',
            'Eat slowly and chew thoroughly for better digestion.',
            'Include anti-inflammatory foods like turmeric or berries.',
            'Limit processed foods and choose whole food alternatives.',
            'Practice portion control using smaller plates.'
        ]
    },
    sleep: {
        icon: 'fas fa-bed',
        tips: [
            'Prioritize 7-9 hours of quality sleep tonight.',
            'Create a calming bedtime routine starting 1 hour before sleep.',
            'Keep your bedroom cool, dark, and quiet.',
            'Avoid screens 1 hour before bedtime.',
            'Try reading a book before sleep instead of scrolling.',
            'Practice progressive muscle relaxation in bed.',
            'Keep a consistent sleep schedule, even on weekends.',
            'Avoid caffeine after 2 PM for better sleep quality.',
            'Use blackout curtains or an eye mask.',
            'Try a warm bath before bed to lower body temperature.',
            'Keep a sleep diary to track patterns.',
            'Invest in a comfortable mattress and pillows.',
            'Practice deep breathing exercises in bed.',
            'Avoid large meals close to bedtime.',
            'Create a technology-free bedroom environment.'
        ]
    },
    social: {
        icon: 'fas fa-users',
        tips: [
            'Call or text a friend or family member you haven\'t spoken to recently.',
            'Practice active listening in your conversations today.',
            'Compliment someone genuinely.',
            'Join a community group or club with shared interests.',
            'Volunteer for a cause you care about.',
            'Have a device-free meal with loved ones.',
            'Write a thank-you note to someone who has helped you.',
            'Practice empathy by trying to understand others\' perspectives.',
            'Reach out to someone who might be feeling lonely.',
            'Share a positive experience with a friend.',
            'Practice forgiveness in a strained relationship.',
            'Plan a social activity for the weekend.',
            'Express your feelings honestly to someone you trust.',
            'Ask someone about their day and really listen.',
            'Offer help to a neighbor or colleague.'
        ]
    },
    stress: {
        icon: 'fas fa-leaf',
        tips: [
            'Take 5 deep breaths when feeling overwhelmed.',
            'Practice the 4-7-8 breathing technique for instant calm.',
            'Take a 10-minute break from your current task.',
            'Listen to calming music or nature sounds.',
            'Practice progressive muscle relaxation.',
            'Write down your worries and then let them go.',
            'Take a warm shower or bath to relax.',
            'Do gentle stretching to release physical tension.',
            'Practice saying "no" to additional stressors today.',
            'Organize one small area to create a sense of control.',
            'Practice positive self-talk when facing challenges.',
            'Take a mental health day if needed.',
            'Use aromatherapy with lavender or chamomile.',
            'Practice time management to reduce overwhelm.',
            'Seek support from friends, family, or professionals.'
        ]
    },
    creativity: {
        icon: 'fas fa-palette',
        tips: [
            'Engage in a creative activity for 15 minutes.',
            'Try drawing, painting, or sketching for relaxation.',
            'Write in a creative journal or try poetry.',
            'Learn a new craft or hobby.',
            'Take photos of interesting things you notice.',
            'Try cooking a new recipe as creative expression.',
            'Listen to music that inspires you.',
            'Rearrange or decorate a space in your home.',
            'Try improvisational activities like dancing or singing.',
            'Work on a puzzle or brain teaser.',
            'Create something with your hands - clay, origami, etc.',
            'Write a letter to your future self.',
            'Try a new art medium you\'ve never used.',
            'Create a vision board for your goals.',
            'Collaborate on a creative project with someone.'
        ]
    },
    nature: {
        icon: 'fas fa-tree',
        tips: [
            'Spend at least 15 minutes outdoors today.',
            'Take a walk in a park or natural area.',
            'Sit outside and observe the sky for 10 minutes.',
            'Start a small garden or tend to houseplants.',
            'Have your morning coffee or tea outside.',
            'Go for a hike or nature walk.',
            'Practice earthing by walking barefoot on grass.',
            'Watch the sunrise or sunset mindfully.',
            'Listen to natural sounds like birds or water.',
            'Collect natural objects like leaves or stones.',
            'Have a picnic in a natural setting.',
            'Try outdoor photography.',
            'Practice forest bathing - immerse yourself in nature.',
            'Stargaze for 15 minutes before bed.',
            'Open windows for fresh air and natural light.'
        ]
    },
    learning: {
        icon: 'fas fa-book',
        tips: [
            'Read for 20 minutes in a book that interests you.',
            'Learn 5 new words in a foreign language.',
            'Watch an educational video or documentary.',
            'Take an online course in something you\'re curious about.',
            'Listen to an educational podcast.',
            'Practice a new skill for 15 minutes.',
            'Read an article about a topic you know nothing about.',
            'Try to understand a complex concept by explaining it simply.',
            'Visit a museum or cultural site (virtually or in person).',
            'Learn about a different culture or tradition.',
            'Practice a musical instrument or learn a new song.',
            'Try to solve a challenging problem or riddle.',
            'Learn about a historical event or figure.',
            'Explore a new field of science or technology.',
            'Teach someone else something you know well.'
        ]
    }
};

// Generate 365 unique tips
function generateWellnessTips() {
    const tips = [];
    const categories = Object.keys(WELLNESS_CATEGORIES);
    
    for (let day = 0; day < 365; day++) {
        const categoryIndex = day % categories.length;
        const category = categories[categoryIndex];
        const categoryData = WELLNESS_CATEGORIES[category];
        const tipIndex = Math.floor(day / categories.length) % categoryData.tips.length;
        
        tips.push({
            icon: categoryData.icon,
            content: categoryData.tips[tipIndex],
            category: category.charAt(0).toUpperCase() + category.slice(1)
        });
    }
    
    return tips;
}

const WELLNESS_TIPS = generateWellnessTips();

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WELLNESS_TIPS;
}
