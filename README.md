# AuthEpic-Automation


# To install smart reporter  
npm install playwright-smart-reporter

# To initialize in playwright.config.js file    
reporter: [   
    ['list'],    
    ['playwright-smart-reporter', {   
      outputFolder: 'test-results',    
      filename: 'report.html',     
      open: 'never'    
    }]    
  ],     
   

