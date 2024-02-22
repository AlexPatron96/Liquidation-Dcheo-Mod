import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootswatch/dist/litera/bootstrap.min.css";
import LoadingScreen from "./layout/LoadingScreen";
import { useSelector } from "react-redux";
import Login from "../src/routes/auth/Login";
import Sigin from "./routes/auth/Sigin";
import Dashboard from "./routes/dashboard/Dashboard";
import Home from "./routes/dashboard/Home";
import Vehicles from "./routes/dashboard/Vehicles";
import Sellers from "./routes/dashboard/Sellers";
import Customers from "./routes/dashboard/Customers";
import Selectvehliq from "./routes/dashboard/Liquidation/vehicles/Selectvehliq";
import Invoice from "./routes/dashboard/Invoice";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Index from "./routes/dashboard/Liquidation/Index";
import IndexVeh from "./routes/dashboard/Liquidation/vehicles/Subindex";
import Liquidationveh from "./routes/dashboard/Liquidation/vehicles/Liquidationveh";
import IndexSell from "./routes/dashboard/Liquidation/sellers/Indexseller";
import Selectsellerliq from "./routes/dashboard/Liquidation/sellers/Selectsellerliq";
import Liquidationsell from "./routes/dashboard/Liquidation/sellers/Liquidationsell";
import LiquidationSellerPdf from "./components/print/LiquidationSellerPdf";
import Recepterinvoice from "./routes/dashboard/Liquidation/sellers/Recepterinvoice";
import InvoiceGive from "./components/print/InvoiceGive";
import IndexCloseout from "./routes/dashboard/Closeouts/Index";
import IndexCloseoutSell from "./routes/dashboard/Closeouts/sellers/Index";
import IndexCloseoutVeh from "./routes/dashboard/Closeouts/vehicles/Index";
import LiquidationInfoSeller from "./routes/dashboard/Closeouts/sellers/LiquidationInfoSeller";
import PreLiquidationSeller from "./routes/dashboard/Closeouts/sellers/PreLiquidationSeller";
import LiquidationVehiclePdf from "./components/print/LiquidationVehiclePdf";
import LiquidationInfoVeh from "./routes/dashboard/Closeouts/vehicles/LiquidationInfoVeh";
import Config from "./routes/auth/Config";
function App() {
	const isLoading = useSelector((state) => state.isLoading);

	return (
		<BrowserRouter>
			{isLoading && <LoadingScreen />}
			<Routes>
				{/* <Route path="/" element={<Dashboard />} /> */}

				<Route path="/login" element={<Login />} />
				<Route path="/signin" element={<Sigin />} />

				<Route element={<ProtectedRoutes />}>
					<Route
						path="/dashboard/liquidation/sellers/print/:id"
						element={<LiquidationSellerPdf />}
					/>
					<Route
						path="/dashboard/liquidation/sellers/:id/print/invoice-give"
						element={<InvoiceGive />}
					/>

					<Route
						path="/dashboard/liquidation/vehicle/print/:id"
						element={<LiquidationVehiclePdf />}
					/>
					{/* <Route path="/dashboard/liquidation/vehicle/:id/print/invoice-give" element={<InvoiceGive />} /> */}

					<Route path="/dashboard" element={<Dashboard />}>
						<Route
							path="/dashboard/auth/config"
							element={<Config />}
						/>
						<Route index element={<Home />} />
						<Route
							path="/dashboard/vehicles"
							element={<Vehicles />}
						/>
						<Route
							path="/dashboard/sellers"
							element={<Sellers />}
						/>
						<Route
							path="/dashboard/customers"
							element={<Customers />}
						/>
						<Route
							path="/dashboard/invoice"
							element={<Invoice />}
						/>

						<Route
							path="/dashboard/closeout"
							element={<IndexCloseout />}
						>
							<Route
								path="/dashboard/closeout/seller"
								element={<IndexCloseoutSell />}
							>
								<Route
									path="/dashboard/closeout/seller/liquidation-seller"
									element={<LiquidationInfoSeller />}
								/>
								<Route
									path="/dashboard/closeout/seller/pre-liquidation-seller"
									element={<PreLiquidationSeller />}
								/>
							</Route>
							<Route
								path="/dashboard/closeout/vehicle"
								element={<IndexCloseoutVeh />}
							>
								<Route
									path="/dashboard/closeout/vehicle/liquidation-vehicle"
									element={<LiquidationInfoVeh />}
								/>
								{/* <Route path="/dashboard/closeout/seller/pre-liquidation-seller" element={<PreLiquidationSeller />} /> */}
							</Route>
						</Route>

						<Route
							path="/dashboard/liquidation"
							element={<Index />}
						>
							<Route
								path="/dashboard/liquidation/vehicles"
								element={<IndexVeh />}
							>
								<Route index element={<Selectvehliq />} />
								<Route
									path="/dashboard/liquidation/vehicles/:id"
									element={<Liquidationveh />}
								/>
								{/* <Route path="/dashboard/liquidation/vehicles/:id" element={<Liquidationveh />} /> */}
							</Route>
							<Route
								path="/dashboard/liquidation/sellers"
								element={<IndexSell />}
							>
								<Route index element={<Selectsellerliq />} />
								<Route
									path="/dashboard/liquidation/sellers/:id"
									element={<Liquidationsell />}
								/>
								<Route
									path="/dashboard/liquidation/sellers/:id/received-inovices"
									element={<Recepterinvoice />}
								/>
							</Route>
						</Route>
					</Route>
				</Route>

				<Route
					path="*"
					element={<Navigate replace to={"/dashboard"} />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
