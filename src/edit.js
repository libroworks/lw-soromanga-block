import { __ } from '@wordpress/i18n';
import { useState, RawHTML } from '@wordpress/element';
import {
	PlainText,
	useBlockProps,
	transformStyles,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { InspectorControls } from '@wordpress/editor';
// const { serverSideRender: ServerSideRender } = wp;
import {
	PanelBody,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import './editor.scss';


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
				"f": "@frame:([\\w\\- ]+)",
				"r": '<div class="frame $1"><div class="serif">'
			},
			{
				"f": "@fend",
				"r": "</div></div>"
			},
			{
				"f": "@センセ「([\\w\\- ]+)",
				"r": "@「yuki $1"
			},
			{
				"f": "@デシ「([\\w\\- ]+)",
				"r": "@「alice $1"
			},
			{
				"f": "@「([\\w\\- ]+)",
				"r": '<div class="frame $1"><div class="serif">'
			},
			{
				"f": "@」",
				"r": "</div></div>"
			},
			{
				"f": "&lt;br&gt;",
				"r": "<br>"
			},
			{
				"f": "@o:(.*)",
				"r": '<div class="fukuromoji"><div class="fukurochild">$1</div></div>'
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
			<InspectorControls>
				<PanelBody title="default face pattern">
					<p>namida<br />shibu<br />hatena<br />gyao<br />doya<br />fuan<br />yatta<br />sumashi</p>
					<p>jito<br />shock<br />anone<br />kohon<br />gohoubi<br />iyada<br />soreda<br />desuyo</p>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
