// User Interface
interface User {
  id: string;
  email: string;
  password: string;
  fName: string;
  lName: string;
  createdAt: Date;
  dateOfBirth: Date;
  Cart?: Cart;
  country: any; // Use a more specific type if possible (e.g., an object with known properties)
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiresAt?: Date | null;
}

type Message = {
  id: string;
  createdAt: Date;
  isUser: boolean;
  email: string;
  name: string;
  subject: string;
  message: string;
};

// PendingUser Interface
interface PendingUser {
  id: string;
  email: string;
  country: any; // Use a more specific type if possible
  verificationCode?: VerificationCode | null;
  OAuth: boolean;
}

// Admin Interface
interface Admin {
  id: string;
  email: string;
  role: string;
  verificationCode?: VerificationCode | null;
}

// Manager Interface
interface Manager {
  id: string;
  email: string;
  createdAt: Date;
  role: string;
  verificationCode?: VerificationCode | null;
}

interface Rates {
  ratedUser: boolean;
  rates: Rating[];
}
interface Rating {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date | null;

  userId: string;
  user: User; // Assuming you have a User interface defined

  productId: string;
  product: Product; // Assuming you have a Product interface defined
}

// VerificationCode Interface
interface VerificationCode {
  id: string;
  code: string;
  createdAt: Date;
  expireIn: Date;
  pendingUserId?: string | null;
  adminId?: string | null;
  managerId?: string | null;

  // Relations
  pendingUser?: PendingUser | null;
  admin?: Admin | null;
  manager?: Manager | null;
}

// Category Interface
interface Category {
  id: string;
  name: string;
  image?: string;
}

// Product Interface
interface Product {
  best?: boolean;
  id: string;
  name: string;
  images: any;
  description: string;
  rate: number;
  price: number;
  createdAt: Date;
  updatedAt: Date | null;
  isFeatured?: boolean | null;
  offer?: number | null;
  categoryId: string;
  category: Category;
  sizes: string[];
}

// Coupon Interface
interface Coupon {
  id: string;
  createdAt: Date;
  updatedAt?: Date | null;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  code: string;
  userId: string;
  user?: User;
}

interface Order {
  product: any;
  quantity: ReactNode;
  price: ReactNode;
  id: string;
  track: string;
  totalAmount: number;
  sessionId: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  method: MethodStatus;
  comment?: string | null;
  items?: OrderItem[];
  userId: string;
  user?: User;
  country: any;
  street: string;
  city: string;
  zipCode: string;
}

interface Wishlist {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  user: User;
  items: WishlistItem[];
}

type SortOption =
  | "latest"
  | "popularity"
  | "rating"
  | "priceLow"
  | "priceHigh"
  | "topOffer";

interface WishlistItem {
  id: string;
  createdAt: Date;
  wishlistId: string;
  wishlist: Wishlist;
  productId: string;
  product: Product;
}

interface OrderItem {
  name: string;
  track: string;
  user: User;
  country: any;
  totalAmount: number;
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product?: Product;
  orderId: string;
  order?: Order;
}

interface Cart {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  user?: User;
  userId: string;
  items: CartItem[];
}

interface CartItem {
  id: string;
  quantity: number;
  totalPrice: number;
  cart?: Cart;
  cartId: string;
  product?: Product;
  productId: string;
}

interface ProgressShapping {
  compelete: boolean;
  left_money: number;
  left_precentage: number;
  precentage: number;
  shipping: number;
}
interface Slider {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}
