import SubNavbar from "../SubNavbar/SubNavbar"
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar"
import { formatPrice, formatDate } from "../../utils/format"
import {
  calculateOrderSubtotal,
  calculateItemSubtotal,
  calculateTaxesAndFees,
  calculateTotal,
} from "../../utils/calculations"
import "./Orders.css"

export default function Orders({
  user,
  orders,
  activeCategory,
  setActiveCategory,
  handleOnSearchInputChange,
  searchInputValue,
}) {
  const hasOrders = Boolean(orders?.length)

  return (
    <div className="Orders">
      <Navbar />
      <SubNavbar
        user={user}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        handleOnSearchInputChange={handleOnSearchInputChange}
        searchInputValue={searchInputValue}
      />
      <div className="banner">
        <div className="content">
          <h2>Orders</h2>
        </div>
      </div>

      <div className="content">
        <div className="order-list">
          <div className="order-list-header">
            <span>Order</span>
            <span className="flex-2">Name</span>
            <span className="center">Quantity</span>
            <span className="center">Unit Price</span>
            <span className="center">Cost</span>
          </div>

          {orders?.map((order) => (
            <OrderItem key={order.order_id} order={order} />
          ))}

          {!hasOrders ? (
            <div className="order-item">
              <p>You haven't placed any orders yet.</p>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  )
}

const OrderItem = ({ order }) => {
  const orderItems = order.orderItems ?? []
  const subTotal = calculateOrderSubtotal(orderItems)

  return (
    <div className="order-item" key={order.order_id}>
      <h3>
        Order #{order.order_id}
        {order.created_at ? <span className="order-date"> — {formatDate(order.created_at)}</span> : null}
        {order.status ? <span className="order-status"> ({order.status})</span> : null}
      </h3>
      <div className="order-details">
        {orderItems.map((item) => (
          <div key={item.order_item_id} className="line-item">
            <span className="flex-2">{item.product?.name}</span>
            <span className="center">{item.quantity}</span>
            <span className="center">{formatPrice(item.price)}</span>
            <span className="center">{formatPrice(calculateItemSubtotal(item.price, item.quantity))}</span>
          </div>
        ))}
        <div className="receipt">
          <div className="receipt-subtotal">
            <span className="label">Subtotal</span>
            <span />
            <span />
            <span className="center">{formatPrice(subTotal)}</span>
          </div>
          <div className="receipt-taxes">
            <span className="label">Taxes and Fees</span>
            <span />
            <span />
            <span className="center">{formatPrice(calculateTaxesAndFees(subTotal))}</span>
          </div>
          <div className="receipt-total">
            <span className="label">Total</span>
            <span />
            <span />
            <span className="center">{formatPrice(calculateTotal(subTotal))}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
