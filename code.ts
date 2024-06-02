// figma.showUI(__html__);
// figma.ui.onmessage =  (msg: {type: string, count: number}) => {
//   if (msg.type === 'create-rectangles') {
//     const nodes: SceneNode[] = [];
//     for (let i = 0; i < msg.count; i++) {
//       const rect = figma.createRectangle();
//       rect.x = i * 150;
//       rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//       figma.currentPage.appendChild(rect);
//       nodes.push(rect);
//     }
//     figma.currentPage.selection = nodes;
//     figma.viewport.scrollAndZoomIntoView(nodes);
//   }
//   figma.closePlugin();
// };

figma.showUI(__html__, { width: 500, height: 500 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'process-images') {
    const selection = figma.currentPage.selection;
    
    if (selection.length !== 6 || !selection.every(node => node.type === 'RECTANGLE')) {
      figma.closePlugin("Please select exactly 6 images.");
      return;
    }

    // 1. 画像の横幅と高さを取得します
    const dimensions = selection.map(node => ({
      width: node.width,
      height: node.height
    }));

    // 2. 一番大きい値を取得します
    const maxDimension = Math.max(...dimensions.map(d => Math.max(d.width, d.height)));

    // 3. 正方形をFrameで作成します
    const squareFrame = figma.createFrame();
    squareFrame.resize(maxDimension, maxDimension);
    squareFrame.fills = [];
    squareFrame.layoutMode = 'NONE';
    
    // 4. 正方形を複製します
    const frames = [squareFrame];
    for (let i = 1; i < 6; i++) {
      const newFrame = squareFrame.clone();
      newFrame.x = i * (maxDimension + 20); // 余白を追加して横に並べる
      frames.push(newFrame);
    }

    // 5. 正方形の中に画像を中央配置します
    frames.forEach((frame, index) => {
      const image = selection[index];
      figma.currentPage.appendChild(frame);
      frame.appendChild(image);
      image.x = (frame.width - image.width) / 2;
      image.y = (frame.height - image.height) / 2;
    });

    figma.ui.postMessage({ type: 'export-done', images: exportedImages });
    figma.closePlugin("Images exported successfully!");
  }
};