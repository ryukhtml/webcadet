
  var Module = typeof Module != 'undefined' ? Module : {};

  if (!Module['expectedDataFileDownloads']) Module['expectedDataFileDownloads'] = 0;
  Module['expectedDataFileDownloads']++;
  (() => {
    // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
    var isPthread = typeof ENVIRONMENT_IS_PTHREAD != 'undefined' && ENVIRONMENT_IS_PTHREAD;
    var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != 'undefined' && ENVIRONMENT_IS_WASM_WORKER;
    if (isPthread || isWasmWorker) return;
    var isNode = globalThis.process && globalThis.process.versions && globalThis.process.versions.node && globalThis.process.type != 'renderer';
    async function loadPackage(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = 'SpaceCadetPinball.data';
      var REMOTE_PACKAGE_BASE = 'SpaceCadetPinball.data';
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      async function fetchRemotePackage(packageName, packageSize) {
        if (isNode) {
          var contents = require('fs').readFileSync(packageName);
          return new Uint8Array(contents).buffer;
        }
        if (!Module['dataFileDownloads']) Module['dataFileDownloads'] = {};
        try {
          var response = await fetch(packageName);
        } catch (e) {
          throw new Error(`Network Error: ${packageName}`, {e});
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.url}`);
        }

        const chunks = [];
        const headers = response.headers;
        const total = Number(headers.get('Content-Length') || packageSize);
        let loaded = 0;

        Module['setStatus'] && Module['setStatus']('Downloading data...');
        const reader = response.body.getReader();

        while (1) {
          var {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          Module['dataFileDownloads'][packageName] = {loaded, total};

          let totalLoaded = 0;
          let totalSize = 0;

          for (const download of Object.values(Module['dataFileDownloads'])) {
            totalLoaded += download.loaded;
            totalSize += download.total;
          }

          Module['setStatus'] && Module['setStatus'](`Downloading data... (${totalLoaded}/${totalSize})`);
        }

        const packageData = new Uint8Array(chunks.map((c) => c.length).reduce((a, b) => a + b, 0));
        let offset = 0;
        for (const chunk of chunks) {
          packageData.set(chunk, offset);
          offset += chunk.length;
        }
        return packageData.buffer;
      }

      var fetchPromise;
      var fetched = Module['getPreloadedPackage'] && Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);

      if (!fetched) {
        // Note that we don't use await here because we want to execute the
        // the rest of this function immediately.
        fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
      }

    async function runWithFS(Module) {

      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }

      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData ' + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          for (var file of metadata['files']) {
            var name = file['filename'];
            var data = byteArray.subarray(file['start'], file['end']);
            // canOwn this data in the filesystem, it is a slice into the heap that will never change
        Module['FS_createDataFile'](name, null, data, true, true, true);
          }
          Module['removeRunDependency']('datafile_SpaceCadetPinball.data');
      }
      Module['addRunDependency']('datafile_SpaceCadetPinball.data');

      if (!Module['preloadResults']) Module['preloadResults'] = {};

      Module['preloadResults'][PACKAGE_NAME] = {fromCache: false};
      if (!fetched) {
        fetched = await fetchPromise;
      }
      await processPackageData(fetched);

    }
    // Detect whether the module JS file has already been loaded.
    if (Module['FS_createPath']) {
      runWithFS(Module);
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module['preRun'].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/CADET.BMP", "start": 0, "end": 15484}, {"filename": "/CADET.DAT", "start": 15484, "end": 4073625}, {"filename": "/FONT.DAT", "start": 4073625, "end": 4077572}, {"filename": "/SOUND1.WAV", "start": 4077572, "end": 4133062}, {"filename": "/SOUND104.WAV", "start": 4133062, "end": 4134288}, {"filename": "/SOUND105.WAV", "start": 4134288, "end": 4136256}, {"filename": "/SOUND108.WAV", "start": 4136256, "end": 4144010}, {"filename": "/SOUND12.WAV", "start": 4144010, "end": 4148306}, {"filename": "/SOUND131.WAV", "start": 4148306, "end": 4149596}, {"filename": "/SOUND14.WAV", "start": 4149596, "end": 4152598}, {"filename": "/SOUND16.WAV", "start": 4152598, "end": 4153644}, {"filename": "/SOUND17.WAV", "start": 4153644, "end": 4155734}, {"filename": "/SOUND18.WAV", "start": 4155734, "end": 4159720}, {"filename": "/SOUND19.WAV", "start": 4159720, "end": 4164950}, {"filename": "/SOUND20.WAV", "start": 4164950, "end": 4173600}, {"filename": "/SOUND21.WAV", "start": 4173600, "end": 4182794}, {"filename": "/SOUND22.WAV", "start": 4182794, "end": 4190170}, {"filename": "/SOUND24.WAV", "start": 4190170, "end": 4202276}, {"filename": "/SOUND25.WAV", "start": 4202276, "end": 4227980}, {"filename": "/SOUND26.WAV", "start": 4227980, "end": 4235286}, {"filename": "/SOUND27.WAV", "start": 4235286, "end": 4255528}, {"filename": "/SOUND28.WAV", "start": 4255528, "end": 4264178}, {"filename": "/SOUND29.WAV", "start": 4264178, "end": 4274542}, {"filename": "/SOUND3.WAV", "start": 4274542, "end": 4297400}, {"filename": "/SOUND30.WAV", "start": 4297400, "end": 4319970}, {"filename": "/SOUND34.WAV", "start": 4319970, "end": 4321490}, {"filename": "/SOUND35.WAV", "start": 4321490, "end": 4340988}, {"filename": "/SOUND36.WAV", "start": 4340988, "end": 4374836}, {"filename": "/SOUND38.WAV", "start": 4374836, "end": 4387860}, {"filename": "/SOUND39.WAV", "start": 4387860, "end": 4416142}, {"filename": "/SOUND4.WAV", "start": 4416142, "end": 4432768}, {"filename": "/SOUND42.WAV", "start": 4432768, "end": 4461908}, {"filename": "/SOUND43.WAV", "start": 4461908, "end": 4484704}, {"filename": "/SOUND45.WAV", "start": 4484704, "end": 4494474}, {"filename": "/SOUND49.WAV", "start": 4494474, "end": 4496350}, {"filename": "/SOUND49D.WAV", "start": 4496350, "end": 4499680}, {"filename": "/SOUND5.WAV", "start": 4499680, "end": 4502860}, {"filename": "/SOUND50.WAV", "start": 4502860, "end": 4514934}, {"filename": "/SOUND54.WAV", "start": 4514934, "end": 4533184}, {"filename": "/SOUND55.WAV", "start": 4533184, "end": 4555074}, {"filename": "/SOUND57.WAV", "start": 4555074, "end": 4585576}, {"filename": "/SOUND58.WAV", "start": 4585576, "end": 4588984}, {"filename": "/SOUND7.WAV", "start": 4588984, "end": 4615426}, {"filename": "/SOUND8.WAV", "start": 4615426, "end": 4617528}, {"filename": "/SOUND9.WAV", "start": 4617528, "end": 4637626}], "remote_package_size": 4637626});

  })();
