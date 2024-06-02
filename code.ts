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
      height: node.height,
      x: node.x,
      y: node.y
    }));

    // 2. 一番大きい値を取得します
    const maxDimension = Math.max(...dimensions.map(d => Math.max(d.width, d.height)));

    // 3. 正方形をFrameで作成し、元の位置に配置
    const frames = dimensions.map((dim, index) => {
      const squareFrame = figma.createFrame();
      squareFrame.resize(maxDimension, maxDimension);
      squareFrame.fills = [];
      squareFrame.layoutMode = 'NONE';
      squareFrame.x = dim.x + index * (20); // 余白を追加して横に並べる
      squareFrame.y = dim.y;
      figma.currentPage.appendChild(squareFrame);
      return squareFrame;
    });

    // 4. 正方形の中に画像を中央配置します
    frames.forEach((frame, index) => {
      const image = selection[index];
      frame.appendChild(image);
      image.x = (frame.width - image.width) / 2;
      image.y = (frame.height - image.height) / 2;
    });

    // 5. 作成したフレームをすべて選択
    figma.currentPage.selection = frames;

    figma.closePlugin("Frames created, images centered, and frames selected successfully!");
  }
};
