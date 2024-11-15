const BUTOPEA = 'https://butopea.com'

describe('Check if the main square contains some text', () => {
  it('Check', () => {
    // Visit the page first
    cy.visit(BUTOPEA)

    // There are 3 banners, this task need the center one
    // so skip the first, and take the second
    cy.get('#home div.banner-square-column:nth-child(2) div.banner-square-overlay-heading p')

      // Get the text, check if it is something (not empty) by using regex
      .invoke('text')
      .should('match', /\w+/)

      // Log the text in the cy console and save the log too
      .then(text => {
        cy.log(`Found text in the main square: "${text.trim()}"`)

        cy.writeFile(
          'cypress/logs/text.txt', 
          `Found text in the main square: "${text.trim()}"`, 
          { flag: 'w+' }
        )
      })
  })
})

describe('Check if the main square contains a button', () => {
  it('Check', () => {
    // Visit the page first
    cy.visit(BUTOPEA)

    // There are 3 banners, this task need the center one
    // so take the second
    // then jump to where the button is
    cy.get('#home div.banner-square-column:nth-child(2) div.banner-square-overlay-cta button')

      // Take the text of button (label)
      // Check if it is something (not empty) by using regex
      .invoke('text')
      .should('match', /\w+/)

      // Log the label in the cy console and save the log too
      .then(text => {
        cy.log(`Found button label in the main square: "${text.trim()}"`)

        cy.writeFile(
          'cypress/logs/label.txt', 
          `Found button label in the main square: "${text.trim()}"`, 
          { flag: 'w+' }
        )
      })
  })
})

describe('Check if the image exists in the right square', () => {
  it('Check', () => {
    // Visit the page first
    cy.visit(BUTOPEA)

    // This time we process the last banner
    // Jump where the img element is
    cy.get('#home div.banner-square-column:last() img')

      // Take the src attribute
      .invoke('attr', 'src')

      // Store the link
      // Add the prefix: https://butopea.com
      // Log the result, save the log too
      .then(src => {
        cy.log(`Found image link: ${BUTOPEA}${src}`)

        cy.writeFile(
          'cypress/logs/image_link.txt', 
          `Found image link: ${BUTOPEA}${src}`, 
          { flag: 'w+' }
        )
      })
  })
})


describe('Click Testing', () => {
  it('Check', () => {
    // Visi the page first
    cy.visit(BUTOPEA)

    // This is where the navigation is placed
    // We take the last one (New Arrivals)
    cy.get('#home-tabs-wrapper div.tab:has(button):last() button')

      // Simulating the click
      .click()

    // It takes some secs to load the page
    cy.wait(3000)

    const products = []

    // Get the products
    cy.get('div.product-listing > div')
      .each($product => {
        const product = {}

        // Wrap it up to be able to chain
        // other cy's methods
        cy.wrap($product)

          // Where the product's data is placed
          .find('div.product a')
          .then($anchor => {

            // Save the product's link
            cy.wrap($anchor)
              .invoke('attr', 'href')
              .then(href => product.href = href)
            
            // Save the product image's link
            // Add the prefix: https://butopea.com
            cy.wrap($anchor)
              .find('img.product-image__thumb')
              .invoke('attr', 'src')
              .then(src => product.image_link = `${BUTOPEA}${src}`)

            // Save the product's title
            cy.wrap($anchor)
              .find('div.product-tile-info p')
              .invoke('text')
              .then(text => product.title = text.trim())

            // Save the product's price
            // This will be a string, not a number
            cy.wrap($anchor)
              .find('div.product-tile-info div')
              .invoke('text')
              .then(text => product.price = text.trim())
          })
          .then(() => products.push(product))
      })

      // Log and Save the products
      .then(() => {
        cy.log(products)

        cy.writeFile(
          'cypress/logs/products.txt', 
          JSON.stringify(products, null, 2), 
          { flag: 'w+' }
        )
      })
  })
})
