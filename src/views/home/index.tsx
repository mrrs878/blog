import React from 'react';

import style from './index.module.less';
import MPreview from '../../components/MEditor/Preview';
import MContent from '../../components/MContent';

const initialSource = `
# Live demo
    
> Changes are automatically rendered as you type.

## Table of Contents

* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual, "native" React DOM elements
* Allows you to escape or skip HTML (try toggling the checkboxes above)
* If you escape or skip the HTML, no \`dangerouslySetInnerHTML\` is used! Yay!

## HTML block below

<blockquote>
  This blockquote will change based on the HTML settings above.
</blockquote>

## How about some code?
\`\`\`js
var React = require('react');
var Markdown = require('react-markdown');

React.render(
  <Markdown source="# Your markdown here" />,
  document.getElementById('content')
);
\`\`\`

\`\`\`html
<div>111</div>
<h1>111</h1>
\`\`\`

\`\`\`ts
const a = 12
\`\`\`

Pretty neat, eh?

## Tables?

| Feature   | Support |
| --------- | ------- |
| tables    | ✔ |
| alignment | ✔ |
| wewt      | ✔ |

## More info?

Read **usage** information and more on [GitHub](//github.com/rexxars/react-markdown)

---------------

A component by [Espen Hovlandsdal](https://espen.codes/)
`;

interface PropsI {
}

const Index: React.FC<PropsI> = () => (
  <div>
    <div className="container" style={{ padding: 0, marginTop: 0 }}>
      <MPreview value={initialSource} fullscreen />
    </div>
    <MContent />
  </div>
);

export default Index;
