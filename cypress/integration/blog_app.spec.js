describe('Blog App', function() {

    beforeEach(() => {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Mubarak Basha',
            username: 'mubarak',
            password: 'basha'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.visit('http://localhost:3000')
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.request('POST', 'http://localhost:3003/api/login', {
                username: 'mubarak', password: 'basha'
            }).then(response => {
                localStorage.setItem('user', JSON.stringify(response.body))
                cy.visit('http://localhost:3000')
            })
        })
    })

    it('user can login', function() {
        cy.contains('Show Login').click()
        cy.get('#username').type('mubarak')
        cy.get('#password').type('basha')
        cy.contains('login').click()
    })

    it.only('login fails with wrong password', function() {
        cy.contains('Show Login').click()
        cy.get('#username').type('mubarak')
        cy.get('#password').type('bahsa')
        cy.contains('login').click()

        cy.get('.error')
            .should('contain', 'Invalid username or password')
            .and('have.css', 'color', 'rgb(236, 72, 153)')

        cy.get('html').should('not.contain', 'Mubarak Basha logged in')
    })


})