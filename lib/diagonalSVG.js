const svgString = `<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
                    <line x1="0%" y1="0%" x2="100%" y2="100%" style="stroke: #e2e8f0; stroke-width: 1;"/>
                   </svg>`;
const buff = new Buffer(svgString);

export default buff.toString('base64');
