# main.py
import decky_plugin

class Plugin:
    async def _main(self):
        decky_plugin.logger.info("PlayCount Plugin loaded")

    async def _unload(self):
        decky_plugin.logger.info("PlayCount Plugin unloaded")

    async def _migration(self):
        pass