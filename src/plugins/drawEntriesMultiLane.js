import * as d3 from 'd3';
import { Point, Interval } from '../utils/getTimelineGroups';
import { showTip, hideTip } from './tooltip';
import roundedRect from './roundedRect';

/**
 *
 * @param g
 * @param data
 * @param groups
 * @param xScale
 * @param yScale
 * @param clipPathId
 * @param symbolSize
 * @param intervalCornerRadius
 */
const drawEntriesMultiLaneX = (g, data, groups, xScale, yScale, clipPathId, symbolSize, intervalCornerRadius) => {
    const entriesSelection = g.selectAll('.entry');
    if (!entriesSelection.empty()) entriesSelection.remove();

    for (let i = 0, l = groups.length; i < l; i += 1) {
        const groupData = data[groups[i]];
        const scaleAxisY = yScale(i).domain(Object.keys(groupData));

        for (let j = 0; j < groupData.length; j += 1) {
            const Y = scaleAxisY(j.toString()),
                H = scaleAxisY.bandwidth(),
                entries = groupData[j];

            for (let k = 0; k < entries.length; k += 1) {
                const entry = entries[k];

                if (entry instanceof Point) {
                    const G = g
                        .append('g')
                        .attr('class', 'entry')
                        .attr('clip-path', `url(#${clipPathId})`);

                    const symbolGen = d3.symbol().size(symbolSize);

                    const symbol = G.append('path')
                        .attr('transform', `translate(${xScale(entry.at)}, ${Y + H / 2})`)
                        .attr('class', `${entry.className ? entry.className : 'entry--point--default'}`)
                        .attr('d', symbolGen.type(d3[entry.symbol] || d3['symbolCircle'])());

                    symbol
                        .on('mouseover', showTip(entry.title))
                        .on('mouseout', hideTip);
                }

                else if (entry instanceof Interval) {
                    const X = xScale(entry.from),
                        W = xScale(entry.to) - X;

                    const G = g
                        .append('g')
                        .attr('class', 'entry');

                    const interval = G.append('path')
                        .attr('class', `${entry.className ? entry.className : 'entry--interval--default'}`)
                        .attr('d', roundedRect(X, Y, W, H, intervalCornerRadius, true, true, true, true))
                        .attr('clip-path', `url(#${clipPathId})`);

                    if (entry.title) {
                        interval
                            .on('mouseover', showTip(entry.title))
                            .on('mouseout', hideTip);
                    }

                    const text = G.append('text')
                        .attr('class', 'entry--label')
                        .attr('text-anchor', 'middle')
                        .attr('pointer-events', 'none')
                        .attr('x', (X + W / 2))
                        .attr('y', (Y + H / 2))
                        .text(entry.label)
                        .attr('fill', '#fff')
                        .attr('dy', '0.32em')
                        .attr('clip-path', `url(#${clipPathId})`);

                    if (text.node().getComputedTextLength() > W) {
                        text.remove();
                    }
                }
            }
        }
    }
};

export {
    drawEntriesMultiLaneX
};
