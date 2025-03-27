import React from "react";
import { PayPalButton } from "react-paypal-button-v2";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

function PayPalPayment() {
    return (
        <div>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Grid item xs={12}>
                    <Card style={{ padding: '60px' }}>
                        <h4>Pay via PayPal</h4>
                        <p></p>  {/* Displaying amount as plain number */}
                        <PayPalButton
                            amount={100}  // Amount in dollars (this is $100.00)
                            onSuccess={(details, data) => {
                                alert("Transaction completed by " + details.payer.name.given_name);
                            }}
                            options={{
                                clientId: "AefW0AEDwBft1Bw7t96r0uBhr6wJuS34zBqqGGZ-bDi_M-hMfqsVs5AteV9tlvRRjJF-cmetybQkihs9"  // Replace with your PayPal client ID
                            }}
                        />
                    </Card>
                </Grid>
            </Box>
        </div>
    );
}

export default PayPalPayment;
