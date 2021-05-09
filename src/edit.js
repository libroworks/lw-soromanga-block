/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import {
	BlockControls,
	PlainText,
	useBlockProps,
	transformStyles,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ToolbarButton,
	ToolbarGroup,
	Disabled,
	SandBox,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes, isSelected }) {
	const [isPreview, setIsPreview] = useState();

	const styles = useSelect((select) => {
		// Default styles used to unset some of the styles
		// that might be inherited from the editor style.
		const defaultStyles = `
			html,body,:root {
				margin: 0 !important;
				padding: 0 !important;
				overflow: visible !important;
				min-height: auto !important;
			}
		`;

		return [
			defaultStyles,
			...transformStyles(
				select(blockEditorStore).getSettings().styles
			),
		];
	}, []);


	function switchToPreview() {
		setIsPreview(true);
	}

	function switchToHTML() {
		setIsPreview(false);
	}

	return (
		<div {...useBlockProps()}>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						className="components-tab-button"
						isPressed={!isPreview}
						onClick={switchToHTML}
					>
						<span>SRC</span>
					</ToolbarButton>
					<ToolbarButton
						className="components-tab-button"
						isPressed={isPreview}
						onClick={switchToPreview}
					>
						<span>Preview</span>
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<Disabled.Consumer>
				{(isDisabled) =>
					isPreview || isDisabled ? (
						<>
							<SandBox
								html={attributes.message}
							/>
							{ /*	
								An overlay is added when the block is not selected in order to register click events. 
								Some browsers do not bubble up the clicks from the sandboxed iframe, which makes it 
								difficult to reselect the block. 
							*/ }
							{!isSelected && (
								<div className="block-library-html__preview-overlay"></div>
							)}
						</>
					) : (
						<PlainText
							value={attributes.message}
							onChange={(val) =>
								setAttributes({ message: val })
							}
							placeholder={__('Write Text')}
							aria-label={__('HTML')}
						/>
					)
				}
			</Disabled.Consumer>
		</div>
	);
}
