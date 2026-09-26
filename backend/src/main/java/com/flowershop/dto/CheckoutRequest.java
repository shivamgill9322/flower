package com.flowershop.dto;

public class CheckoutRequest {
    private String shippingAddress;

    public CheckoutRequest() {}

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
}
