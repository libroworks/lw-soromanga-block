/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { RawHTML } from '@wordpress/element';

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

	function convert_manga(content) {
		const replist = [
			{
				"f": "===[=]*",
				"r": '<div class="soromanga_container">'
			},
			{
				"f": "@divend",
				"r": "</div>"
			},
			{
				"f": "@frame:([a-z|0-9 ]+)",
				"r": '<div class="frame $1"><div class="serif">'
			},
			{
				"f": "@fend",
				"r": "</div></div>"
			},
			{
				"f": "@センセ「([a-z|0-9 ]+)",
				"r": "@「yuki $1"
			},
			{
				"f": "@デシ「([a-z|0-9 ]+)",
				"r": "@「alice $1"
			},
			{
				"f": "@「([a-z|0-9 ]+)",
				"r": '<div class="frame $1"><div class="serif">'
			},
			{
				"f": "@」",
				"r": "</div></div>"
			},
			{
				"f": "!\\[(.*?)\\]\\((.*?)\\)",
				"r": '<img alt="$1" src="$2">'
			},
			{
				"f": "【センセ(.*?)】(.*)",
				"r": '<p class="kaiwa yuki $1"><span class="kaiwaborder">$2</span></p>'
			},
			{
				"f": "【デシ(.*?)】(.*)",
				"r": '<p class="kaiwa alice $1"><span class="kaiwaborder">$2</span></p>'
			},
		];

		content = content.replace(/</g, '&lt;');
		content = content.replace(/>/g, '&gt;');
		content = content.replace(/\n\r/g, '\n');
		content = content.replace(/\r/g, '\n');
		const lcontent = content.split('\n');
		for (const repitem of replist) {
			for (let i = 0; i < lcontent.length; i++) {
				lcontent[i] = lcontent[i].replace(new RegExp(repitem.f, 'g'), repitem.r);
			}
		}
		content = lcontent.join('\n');
		return (content);
	}

	return (
		<div {...useBlockProps()}>
			{ attributes.message && isSelected ? (
				<RawHTML class="soromaga_preview">
					{convert_manga(attributes.message)}
				</RawHTML>
			) : (<span></span>)}
			<PlainText
				value={attributes.message}
				onChange={(val) => {
					setAttributes({ message: val });
				}
				}
				placeholder={__('Write Text')}
				aria-label={__('HTML')}
			/>
		</div>
	);
}
