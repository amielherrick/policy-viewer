const fs = require('fs');
const path = require('path');

const calfreshPath = path.join(__dirname, 'src', 'assets', 'policies', 'CalFresh');
const outputPath = path.join(__dirname, 'src', 'assets', 'policies', 'calfresh-navigation.json');

function cleanFileName(filename) {
  // Remove .html extension
  let name = filename.replace('.html', '');
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ');
  
  // Add space before capital letters (but not if already spaced or at start)
  name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Clean up multiple spaces
  name = name.replace(/\s+/g, ' ').trim();
  
  return name;
}

function extractTitle(htmlContent, filename) {
  // Remove HTML comments
  htmlContent = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
  
  // Try to extract from first <h1> tag
  const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match && h1Match[1].trim()) {
    let title = h1Match[1].trim();
    // Remove any HTML tags inside
    title = title.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    title = title.replace(/&nbsp;/g, ' ');
    title = title.replace(/&amp;/g, '&');
    // Clean up whitespace
    title = title.replace(/\s+/g, ' ').trim();
    
    // If title looks good (not too short, not all caps abbreviations), use it
    if (title.length > 3 && !/^[A-Z\s]+$/.test(title)) {
      return title;
    }
  }
  
  // Try title tag
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) {
    let title = titleMatch[1].trim();
    title = title.replace(/<[^>]*>/g, '');
    title = title.replace(/&nbsp;/g, ' ');
    title = title.replace(/&amp;/g, '&');
    title = title.replace(/\s+/g, ' ').trim();
    
    if (title.length > 3 && !/^[A-Z\s]+$/.test(title)) {
      return title;
    }
  }
  
  // Fallback to cleaned filename
  return cleanFileName(filename);
}

function scanDirectory(dirPath) {
  const items = [];
  
  try {
    const folders = fs.readdirSync(dirPath);
    
    folders.forEach(folder => {
      const folderPath = path.join(dirPath, folder);
      const stats = fs.statSync(folderPath);
      
      if (stats.isDirectory()) {
        const files = [];
        const htmlFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.html'));
        
        htmlFiles.forEach(file => {
          const filePath = path.join(folderPath, file);
          let title = cleanFileName(file);
          
          try {
            const htmlContent = fs.readFileSync(filePath, 'utf8');
            title = extractTitle(htmlContent, file);
          } catch (err) {
            console.error(`Error reading file ${file}:`, err.message);
          }
          
          files.push({
            name: title,
            file: file
          });
        });
        
        // Sort files alphabetically by name
        files.sort((a, b) => a.name.localeCompare(b.name));
        
        // Convert folder name to readable title
        const title = cleanFileName(folder);
        
        items.push({
          id: folder.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          title: title,
          folder: folder,
          files: files
        });
      }
    });
    
    // Sort items alphabetically by title
    items.sort((a, b) => a.title.localeCompare(b.title));
    
  } catch (err) {
    console.error('Error scanning directory:', err);
  }
  
  return items;
}

console.log('Scanning CalFresh folders and extracting titles...');
const items = scanDirectory(calfreshPath);

const navigation = {
  sections: [
    {
      id: 'handbook',
      title: 'CalFresh Handbook',
      items: items
    }
  ]
};

fs.writeFileSync(outputPath, JSON.stringify(navigation, null, 2));
console.log(`Navigation file created: ${outputPath}`);
console.log(`Found ${items.length} folders with ${items.reduce((sum, item) => sum + item.files.length, 0)} total files`);