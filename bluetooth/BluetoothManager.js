"use strict";

import BleManager from 'react-native-ble-manager';

export default BluetoothManager = {
    scanning: false,
    peripherals: new Map(),
    appState: "",

    init: function() {
        //Constructor
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);

        //Component did Mount
        AppState.addEventListener('change', this.handleAppStateChange);
        BleManager.start({showAlert: false});

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );
    },

    deinit: function(){
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
        this.handlerUpdate.remove();
    },

    handleDisconnectedPeripheral: function(data) {
        console.log("Peripheral disconnected" + data.peripheral);
    },

    handleUpdateValueForCharacteristic: function(data) {
        console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    },

    startScan: function() {
        if (!this.scanning) {
          peripherals = new Map();
          BleManager.scan([], 3, true).then((results) => {
            console.log('Scanning...');
            scanning = true;
          });
        }
      },

      handleDiscoverPeripheral: function(peripheral) {
        var peripherals = this.peripherals;
        if (!peripherals.has(peripheral.id)){
          console.log('Got ble peripheral', peripheral);
          peripherals.set(peripheral.id, peripheral);
          this.peripherals = peripherals;
        }
      },

      retrieveConnected: function() {
        BleManager.getConnectedPeripherals([]).then((results) => {
          if (results.length == 0) {
            console.log('No connected peripherals')
          }
          console.log(results);
          var peripherals = this.peripherals;
          for (var i = 0; i < results.length; i++) {
            var peripheral = results[i];
            peripheral.connected = true;
            peripherals.set(peripheral.id, peripheral);
          }
        });
      }
}