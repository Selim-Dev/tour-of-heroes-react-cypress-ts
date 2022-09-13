import Heroes from './Heroes'
import '../styles.scss'

describe('Heroes', () => {
  it('should go through the error flow', () => {
    Cypress.on('uncaught:exception', () => false)
    cy.clock()
    cy.intercept('GET', `${Cypress.env('API_URL')}/heroes`, {
      statusCode: 400,
      delay: 100,
    }).as('notFound')

    cy.wrappedMount(<Heroes />)

    cy.getByCy('page-spinner').should('be.visible')
    Cypress._.times(4, () => {
      cy.tick(5000)
      cy.wait('@notFound')
    })

    cy.getByCy('error')
  })

  context('200 flows', () => {
    beforeEach(() => {
      cy.intercept('GET', `${Cypress.env('API_URL')}/heroes`, {
        fixture: 'heroes.json',
      }).as('getHeroes')

      cy.wrappedMount(<Heroes />)
    })

    it('should display the hero list on render, and go through hero add & refresh flow', () => {
      cy.wait('@getHeroes')

      cy.getByCy('list-header').should('be.visible')
      cy.getByCy('hero-list').should('be.visible')

      cy.getByCy('add-button').click()
      cy.location('pathname').should('eq', '/heroes/add-hero')

      cy.getByCy('refresh-button').click()
      cy.location('pathname').should('eq', '/heroes')
    })

    const invokeHeroDelete = () => {
      cy.getByCy('delete-button').first().click()
      cy.getByCy('modal-yes-no').should('be.visible')
    }
    it('should go through the modal flow', () => {
      cy.getByCy('modal-yes-no').should('not.exist')

      cy.log('do not delete flow')
      invokeHeroDelete()
      cy.getByCy('button-no').click()
      cy.getByCy('modal-yes-no').should('not.exist')

      cy.log('delete flow')
      invokeHeroDelete()
      cy.intercept('DELETE', '*', {statusCode: 200}).as('deleteHero')

      cy.getByCy('button-yes').click()
      cy.wait('@deleteHero')
      cy.getByCy('modal-yes-no').should('not.exist')
    })
  })
})
