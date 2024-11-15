describe('Check if the main square contains some text', () => {
  it('Check', () => {
    cy.visit('https://butopea.com/')

    cy.get('#home')
      .find('div.banner-square-column')
      .first()
      .next()
      .find('div.banner-square-overlay-heading')
      .children('p')
      .invoke('text')
      .should('match', /\w+/)
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
    cy.visit('https://butopea.com/')

    cy.get('#home')
      .find('div.banner-square-column')
      .first()
      .next()
      .find('div.banner-square-overlay-cta')
      .children('button')
      .invoke('text')
      .should('match', /\w+/)
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
    cy.visit('https://butopea.com/')

    cy.get('#home')
      .find('div.banner-square-column')
      .last()
      .find('img')
      .invoke('attr', 'src')
      .then(src => {
        cy.log(`Found image link: https://butopea.com${src}`)

        cy.writeFile(
          'cypress/logs/image_link.txt', 
          `Found image link: https://butopea.com${src}`, 
          { flag: 'w+' }
        )
      })
  })
})


describe('Click Testing', () => {
  it('Check', () => {
    cy.visit('https://butopea.com/')

    cy.get('#home-tabs-wrapper')
      .find('div.tab:has(button)')
      .last()
      .children('button')
      .click()

    cy.wait(3000)

    const products = []

    cy.get('div.product-listing > div')
      .each($product => {
        const product = {}
        cy.wrap($product)
          .find('div.product a')
          .then($anchor => {
            cy.wrap($anchor)
              .invoke('attr', 'href')
              .then(href => product.href = href)
            
            cy.wrap($anchor)
              .find('img.product-image__thumb')
              .invoke('attr', 'src')
              .then(src => product.image_link = src)

            cy.wrap($anchor)
              .find('div.product-tile-info p')
              .invoke('text')
              .then(text => product.title = text.trim())

            cy.wrap($anchor)
              .find('div.product-tile-info div')
              .invoke('text')
              .then(text => product.price = text.trim())
          })
          .then(() => products.push(product))
      })
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
