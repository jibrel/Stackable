import { camelCase } from 'lodash'
import rgba from 'color-rgba'
import { sprintf } from '@wordpress/i18n'

const createBackgroundStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = ( attrName, defaultValue = '' ) => blockAttributes[ getAttrName( attrName ) ] || defaultValue

	const customSize = getValue( 'BackgroundCustomSize' ) !== '' ? `${ getValue( 'BackgroundCustomSize' ) }${ getValue( 'BackgroundCustomSizeUnit', '%' ) }` : undefined
	const tabletCustomSize = getValue( 'TabletBackgroundCustomSize' ) !== '' ? `${ getValue( 'TabletBackgroundCustomSize' ) }${ getValue( 'TabletBackgroundCustomSizeUnit', '%' ) }` : undefined
	const mobileCustomSize = getValue( 'MobileBackgroundCustomSize' ) !== '' ? `${ getValue( 'MobileBackgroundCustomSize' ) }${ getValue( 'MobileBackgroundCustomSizeUnit', '%' ) }` : undefined

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			backgroundColor: getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
			backgroundAttachment: getValue( 'FixedBackground' ) !== '' ? 'fixed' : undefined,
			backgroundImage: getValue( 'BackgroundMediaURL' ) !== '' ? `url(${ getValue( 'BackgroundMediaURL' ) })` : undefined,
			backgroundPosition: getValue( 'BackgroundPosition' ) !== '' ? getValue( 'BackgroundPosition' ) : undefined,
			backgroundRepeat: getValue( 'BackgroundRepeat' ) !== '' ? getValue( 'BackgroundRepeat' ) : undefined,
			backgroundSize: getValue( 'BackgroundSize' ) !== '' ?
				( getValue( 'BackgroundSize' ) !== 'custom' ? getValue( 'BackgroundSize' ) : customSize ) :
				undefined,
			backgroundBlendMode: getValue( 'BackgroundImageBlendMode' ) !== '' ? getValue( 'BackgroundImageBlendMode' ) : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			backgroundImage: getValue( 'TabletBackgroundMediaURL' ) !== '' ? `url(${ getValue( 'TabletBackgroundMediaURL' ) })` : undefined,
			backgroundPosition: getValue( 'TabletBackgroundPosition' ) !== '' ? getValue( 'TabletBackgroundPosition' ) : undefined,
			backgroundRepeat: getValue( 'TabletBackgroundRepeat' ) !== '' ? getValue( 'TabletBackgroundRepeat' ) : undefined,
			backgroundSize: getValue( 'TabletBackgroundSize' ) !== '' ?
				( getValue( 'TabletBackgroundSize' ) !== 'custom' ? getValue( 'TabletBackgroundSize' ) : tabletCustomSize ) :
				undefined,
		}
	}

	// Mobile.
	return {
		backgroundImage: getValue( 'MobileBackgroundMediaURL' ) !== '' ? `url(${ getValue( 'MobileBackgroundMediaURL' ) })` : undefined,
		backgroundPosition: getValue( 'MobileBackgroundPosition' ) !== '' ? getValue( 'MobileBackgroundPosition' ) : undefined,
		backgroundRepeat: getValue( 'MobileBackgroundRepeat' ) !== '' ? getValue( 'MobileBackgroundRepeat' ) : undefined,
		backgroundSize: getValue( 'MobileBackgroundSize' ) !== '' ?
			( getValue( 'MobileBackgroundSize' ) !== 'custom' ? getValue( 'MobileBackgroundSize' ) : mobileCustomSize ) :
			undefined,
	}
}

export const createBackgroundOverlayStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = ( attrName, defaultValue = '' ) => blockAttributes[ getAttrName( attrName ) ] || defaultValue

	const opacity = parseInt( getValue( 'BackgroundTintStrength', 5 ), 10 ) / 10

	// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
	const defaultColor1 = 'rgba(' + rgba( `${ getValue( 'BackgroundColor2', '#ffffff' ) }00` ).join( ', ' ) + ')'
	const defaultColor2 = 'rgba(' + rgba( `${ getValue( 'BackgroundColor', '#ffffff' ) }00` ).join( ', ' ) + ')'

	// Gradient location.
	const color1Location = `${ getValue( 'BackgroundGradientLocation1', '0' ) }%`
	const color2Location = `${ getValue( 'BackgroundGradientLocation2', '100' ) }%`

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			backgroundColor: getValue( 'BackgroundColorType' ) === '' && getValue( 'BackgroundColor' ) !== '' ? getValue( 'BackgroundColor' ) : undefined,
			backgroundImage: getValue( 'BackgroundColorType' ) === 'gradient' ?
				`linear-gradient(${ getValue( 'BackgroundGradientDirection', 0 ) }deg, ${ getValue( 'BackgroundColor', defaultColor1 ) } ${ color1Location }, ${ getValue( 'BackgroundColor2', defaultColor2 ) } ${ color2Location })` :
				undefined,
			opacity: getValue( 'BackgroundMediaURL' ) !== '' ? opacity : undefined,
			mixBlendMode: getValue( 'BackgroundGradientBlendMode' ) !== '' ? getValue( 'BackgroundGradientBlendMode' ) : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			opacity: getValue( 'TabletBackgroundMediaURL' ) !== '' ? opacity : undefined,
		}
	}

	// Mobile.
	return {
		opacity: getValue( 'MobileBackgroundMediaURL' ) !== '' ? opacity : undefined,
	}
}

export const hasBackgroundOverlay = ( attrNameTemplate = '%s', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = ( attrName, defaultValue = '' ) => blockAttributes[ getAttrName( attrName ) ] || defaultValue

	return getValue( 'BackgroundColorType' ) === 'gradient' ||
		getValue( 'BackgroundMediaUrl' ) ||
		getValue( 'TabletBackgroundMediaUrl' ) ||
		getValue( 'MobileBackgroundMediaUrl' )
}

export const createBackgroundStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {} ) => {
	return {
		[ `.${ mainClassName }` ]: {
			...createBackgroundStyles( attrNameTemplate, 'desktop', blockAttributes ),
		},
		[ `.${ mainClassName }:before` ]: {
			...createBackgroundOverlayStyles( attrNameTemplate, 'desktop', blockAttributes ),
		},
		tablet: {
			[ `.${ mainClassName }` ]: {
				...createBackgroundStyles( attrNameTemplate, 'tablet', blockAttributes ),
			},
			[ `.${ mainClassName }:before` ]: {
				...createBackgroundOverlayStyles( attrNameTemplate, 'tablet', blockAttributes ),
			},
		},
		mobile: {
			[ `.${ mainClassName }` ]: {
				...createBackgroundStyles( attrNameTemplate, 'mobile', blockAttributes ),
			},
			[ `.${ mainClassName }:before` ]: {
				...createBackgroundOverlayStyles( attrNameTemplate, 'mobile', blockAttributes ),
			},
		},
	}
}

export default createBackgroundStyles