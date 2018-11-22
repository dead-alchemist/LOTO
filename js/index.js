
var lotoname = "LOTO";
var lotoaddress = "";
var code="";
var lockstate = 0;
var app = {

    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {

        bluetoothSerial.isEnabled(app.listPairedDevices, function () {
            bluetoothSerial.enable(app.listPairedDevices, function () {
                navigator.app.exitApp();
                console.log("The user did *not* enable Bluetooth");
            });
        });
        document.addEventListener("backbutton", function (e) {
            exitdialog();
        });

        db = window.openDatabase("LOTO", "1.0", "Loto Device", 20000);

        $('#retry').click(app.listPairedDevices);
        $('#terminal form').submit(app.sendData);

    },

    PairDevices: function () {

        bluetoothSerial.isEnabled(function () {
            app.listPairedDevices;
        }, function () {
            bluetoothSerial.enable(
                function () {
                    app.listPairedDevices;
                },
                function () {}
            );
        });
    },

    listPairedDevices: function () {

        bluetoothSerial.list(function (devices) {

            if (!devices.length) {
                toast('No Paired devices');
                return;
            }
            var flag=0;
            devices.forEach(function (device) {
                if(device.name=="LOTO"){
                    lotoaddress = device.address;
                    flag=1;
                } 
            });
            if(flag==0){
                toast('Loto is not Paired');
                $('#spinner').fadeOut();
                $('#tile').hide();
                $('#retry').fadeIn();
                bluetoothSerial.showBluetoothSettings();
            }else if(flag=1){
                bluetoothSerial.connect(lotoaddress,function (data){
                    toast('Connected');
                    $('#spinner').hide();
                    $('#retry').hide();
                    $('#tile').hide();
                    $('#home').hide();
                    $('#dash').fadeIn();
                    bluetoothSerial.subscribe('\n', function (data) {
                        $('#phaseno').text(data);
                        $('#faultbar').slideDown();

                    }, app.showError)}, function (error) {
                $('#spinner').fadeOut();
                $('#tile').hide();
                $('#retry').fadeIn();
                toast('Unable to Connect');
    
            });
            }

        }, app.showError);
    },


    deviceDisconnected: function () {

        bluetoothSerial.unsubscribe(toast('Unsubscribed'), app.showError);
        $('#spinner').fadeOut();
        $('#tile').hide();
        $('#retry').fadeIn();

        $('#home').fadeIn();
        $('#dash').hide();

        toast('Disconnected');

    },

    showError: function (error) {
        alert(error);
    },

};
