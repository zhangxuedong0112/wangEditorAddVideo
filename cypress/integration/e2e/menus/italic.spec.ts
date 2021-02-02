describe('斜体样式', () => {
    beforeEach(() => {
        cy.visit('/examples/index.html')

        cy.get('#div1').find('.w-e-text-container').children().first().as('Editable')

        cy.get('@Editable').clear()
    })

    const text = 'test123'

    it('能给选中的内容添加对应的斜体样式', () => {
        cy.get('@Editable').type(text)

        cy.saveRange()

        cy.getByClass('toolbar').children().eq(4).click()
        cy.get('@Editable').find('i').contains(text)
    })
})
