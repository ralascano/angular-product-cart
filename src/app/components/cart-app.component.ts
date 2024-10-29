import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CatalogComponent } from "./catalog/catalog.component";
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from "./navbar/navbar.component";
import { CartModalComponent } from "./cart-modal/cart-modal.component";

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, CartModalComponent],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{

  products: Product[] = [];

  items: CartItem[] = [];

  //total: number = 0;

  showCart: boolean = false;
  
  constructor(private service: ProductService) {}

  ngOnInit(): void {
    this.products = this.service.findAll();
    this.items = JSON.parse(sessionStorage.getItem("cart") || '[]');
    //this.calculateTotal();
  }

  onAddCart(product: Product): void {
    const hasItem = this.items.find(a => {return a.product.id === product.id})
    if(hasItem) {
      this.items = this.items.map(a => {
        if (a.product.id === product.id) {
          return {... a, quantity: a.quantity + 1}
        } else {
          return a;
        }
      })
    } else {
      this.items = [... this.items, {product: {...product}, quantity: 1}];
    }
    //this.calculateTotal();
    //this.saveSession();
  }

  onDeleteCart(id: number): void {
    this.items = this.items.filter(a => {return a.product.id !== id});
    if( this.items.length === 0) {
      sessionStorage.removeItem('cart');
      sessionStorage.clear();
    }
    //this.calculateTotal();
    //this.saveSession();
  }

  /*calculateTotal(): void {
    this.total = this.items.reduce((acc, item) => {
      return acc + (item.quantity * item.product.price);
    }, 0)
  }

  saveSession(): void {
    sessionStorage.setItem("cart", JSON.stringify(this.items))
  }*/
  
  openCart(): void {
    this.showCart = !this.showCart;
  }
}
