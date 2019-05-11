const blockAttributeTests = props => {
	const {
		supports = {},
		attributes = {},
	} = props.settings

	test( 'selectors should not have :nth-child, or similar', () => {
		Object.values( attributes ).filter( attributes => attributes.selector ).forEach( attributes => {
			expect( attributes.selector ).not.toMatch( /:nth-\w/ )
		} )
	} )

	test( 'should not have old custom CSS selectors (< 1.16), remove these from code', () => {
		expect( Object.keys( attributes ) ).not.toContain( 'customCSSUniqueID' )
		expect( Object.keys( attributes ) ).not.toContain( 'customCSS' )
		expect( Object.keys( attributes ) ).not.toContain( 'customCSSCompiled' )
	} )

	test( 'should have an `align` attribute if it is supported', () => {
		if ( typeof supports.align !== 'undefined' ) {
			expect( Object.keys( attributes ) ).toContain( 'align' )
		}
	} )
}

export default blockAttributeTests
