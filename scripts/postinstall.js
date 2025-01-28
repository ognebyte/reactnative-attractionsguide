const fs = require('fs');
const path = require('path');

const replaceImports = (dir) => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            replaceImports(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Замена импорта react-native-linear-gradient на expo-linear-gradient
            const updatedContent = content.replace(
                /import\s+LinearGradient\s+from\s+['"]react-native-linear-gradient['"];/g,
                "import { LinearGradient } from 'expo-linear-gradient';"
            );

            if (updatedContent !== content) {
                fs.writeFileSync(filePath, updatedContent, 'utf8');
                console.log(`Updated imports in: ${filePath}`);
            }
        }
    });
};

replaceImports(path.join(__dirname, '../node_modules/react-native-reanimated-skeleton'));
console.log('Postinstall script completed!');
