// write tests here
describe('Quotes App', () =>{
  beforeEach(() =>{
    cy.visit('http://localhost:1234')
  })

  const textInput = () => cy.get('input[name=text]')
  const authorInput = () => cy.get('input[name=author]')
  const foobarInput = () => cy.get('input[name=foobar]')
  const submitBtn = () => cy.get('button[id="submitBtn"]')
  const cancelBtn = () => cy.get('button[id="cancelBtn"]')

  it('sanity check to make sure tests working', () =>{
    expect(1 + 2).to.equal(3);
    expect(2 + 2).not.to.equal(5);
  })

  it('the proper elements are showing', ()=>{
    textInput().should('exist');
    foobarInput().should('not.exist');
    authorInput().should('exist');
    submitBtn().should('exist');
    cancelBtn().should('exist');
    cy.contains('Submit Quote').should('exist'); //! case sensitive
    cy.contains(/submit quote/i).should('exist'); //? not case sensitive
  })

  describe('filling out thhe inputs and cancelling', () =>{
    //can we navigate to the url?
    it('can can navigate to the url', () =>{
      cy.url().should('include', 'localhost');
    })
    //submit btn starts out disabled
    it('submit btn starts out disabled', () => {
      submitBtn().should('be.disabled')
    })
    //type the inputs
    it('can type in the inputs', () => {
      textInput()
        .should('have.value', '') //the initial
        .type('david rocks!') //?cypress types this
        .should('have.value', 'david rocks!'); //!cypress looks for this
      authorInput().should('have.value', '')
        .type('author should go here')
        .should('have.value', 'author should go here');
    })

    //submit button is not disabled after filling out all info
    it('submit button enables when all inputs are filled', () => {
      authorInput().type('david')
      textInput().type('something')
      submitBtn().should('not.be.disabled');
    })

    //cancel button works
    it('cancel button should return everything to original', () => {
      authorInput().type('something')
      textInput().type('something')
      cancelBtn().click();
      authorInput().should('have.value', '')
      textInput().type('have.value', '')
      submitBtn().should('be.disabled');
    })
  })

  describe('Adding a new quote', () => {
    it('can submit and delete a new quote', () => {
      textInput().type('javascript is not lame');
      authorInput().type('lorem ipsum');
      submitBtn().click();
      cy.contains('lorem ipsum').siblings('button:nth-of-type(2)').click();
      cy.contains('lorem ipsum').should('not.exist')
    })
    it('variation of Can Submit', () => {
      cy.contains('lorem ipsum').should('not.exist') //making sure everything is cleaned up from previous test
      textInput().type('i love testing')
      authorInput().type('David')
      submitBtn().click(); //this should create the element in the DOM
      cy.contains(/david/i).should('exist') //now check to make sure it exists in the DOM
      cy.contains('David').next().next().click();
      cy.contains('DavF').should('not.exist');
    })
  })

  describe('Editing an existing quote', () =>{
    it('can edit a quote', ()=>{
      //first make a submission
      textInput().type('fun times only') //this is tying into text input //!fun times only
      authorInput().type('david'); //typing //! david
      submitBtn().click(); // this is creating it in the dom //! fun times only (david)
      cy.contains('david').siblings('button:nth-of-type(1)').click();  //this is saying that the dom insert with author 'david' , click edit button
      //select that submission
      authorInput().should('have.value', 'david'); //?when we edit this, it goes back to the form with info
      textInput().should('have.value', 'fun times only'); //! checking that text input in form === what is being edited
      //edit that submission
      textInput().clear(); //!this clears the  textbox
      textInput().type('blah blah'); 
      authorInput().type(' fletcher');
      submitBtn().click();
      cy.contains('blah blah (david fletcher)');
      //removing side effects
      cy.contains('david').next().next().click();
      cy.contains('blah blah (david fletcher)').should('not.exist')
    })
  })

///! do not write below this line
})