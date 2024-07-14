const { sendOrderId } = require('../socket');

exports.getOrders = async (req, res) => {
    let orderId = req.params.id;
    let shopId = req.params.shopID;

    // sendOrderId('sendOrderId', orderId)
    // res.status(200).json({
    //   status: "success",
    //   orderId
    // });

    if (shopId) {
        sendOrderId('sendOrderId', shopId, orderId);
        res.status(200).json({
            status: "success",
            shopId: shopId,
            orderId: orderId,
            message: 'Order ID sent to the shop',
        });
    } else {
        res.status(404).json({
            status: "failed",
            shopId: shopId,
            orderId: orderId,
            message: 'Shop ID not found',
        });
    }
  };