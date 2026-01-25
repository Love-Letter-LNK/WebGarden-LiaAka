const fs = require('fs');
const path = require('path');

// Controller untuk Milestones
exports.getMilestones = (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/milestones.json');
        if (!fs.existsSync(dataPath)) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller untuk Memories
exports.getMemories = (req, res) => {
    try {
        const dataPath = path.join(__dirname, '../data/memories.json');
        if (!fs.existsSync(dataPath)) {
            return res.status(404).json({ message: 'Data not found' });
        }
        const data = fs.readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
