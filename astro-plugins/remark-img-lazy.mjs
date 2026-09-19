// 给 Markdown 图片自动添加 loading="lazy" 和 decoding="async"
// 用于避免首屏不必要的图片下载

import { visit } from 'unist-util-visit';

export default function remarkImgLazy() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      // 只设置缺失的属性，不强制覆盖作者显式设置的值
      if (!('loading' in node.data.hProperties)) {
        node.data.hProperties.loading = 'lazy';
      }
      if (!('decoding' in node.data.hProperties)) {
        node.data.hProperties.decoding = 'async';
      }
    });
  };
}
