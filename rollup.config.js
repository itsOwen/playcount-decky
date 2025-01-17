import deckyPlugin from "@decky/rollup";

export default deckyPlugin({
  onwarn(warning, warn) {
    // Ignore circular dependency warnings from d3 and recharts
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' && 
      (
        warning.message.includes('d3-interpolate') ||
        warning.message.includes('recharts')
      )
    ) {
      return;
    }
    warn(warning);
  }
});