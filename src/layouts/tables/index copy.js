import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Custom components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
// Axios for API
import axios from "axios";
function VendorTables() {
  const [vendorRows, setVendorRows] = useState([]);

  const vendorColumns = [
    { Header: "Name", accessor: "name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Business Name", accessor: "businessName" },
    { Header: "Business Type", accessor: "businessType" },
    { Header: "Address", accessor: "address" },
    { Header: "Products", accessor: "products" },
    { Header: "Coordinates", accessor: "coordinates" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8000/vendor/")
      .then((res) => {
        const vendors = res.data;

        const formatted = vendors.map((vendor) => {
          const {
            firstName,
            lastName,
            email,
            phone,
            businessName,
            businessType,
            houseNumberAndArea,
            streetAddress,
            landMark,
            city,
            state,
            pinCode,
            products = [], // Provide default empty array
            location,
          } = vendor;

          const fullName = `${firstName || ""} ${lastName || ""}`.trim();
          const fullAddress = [
            houseNumberAndArea,
            streetAddress,
            landMark,
            city,
            state,
            pinCode && `- ${pinCode}`,
          ]
            .filter(Boolean)
            .join(", ");
          const productList = Array.isArray(products) ? products.join(", ") : "";
          const coords = location?.coordinates ? location.coordinates.join(", ") : "N/A";
          return {
            name: fullName || "N/A",
            email: email || "N/A",
            phone: phone || "N/A",
            businessName: businessName || "N/A",
            businessType: businessType || "N/A",
            address: fullAddress || "N/A",
            products: productList || "None listed",
            coordinates: coords,
          };
        });

        setVendorRows(formatted);
      })
      .catch((err) => {
        console.error("Error fetching vendors", err);
        // Set empty rows on error so the table doesn't stay in loading state
        setVendorRows([]);
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Vendor Directory
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: vendorColumns, rows: vendorRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
export default VendorTables;
