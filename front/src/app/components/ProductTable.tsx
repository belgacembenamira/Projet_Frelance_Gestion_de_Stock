import React, { memo, useState, useMemo } from "react";
import { Product } from "../types/Product";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  TableSortLabel,
  TablePagination,
  useTheme,
  styled,
  useMediaQuery,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { ProductTableProps } from "../types/ProductTableProps";

// Styled component for selected row
const StyledTableRow = styled(TableRow)<{ selected?: boolean }>(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.primary.light : "inherit",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Custom colors for IconButton
const RedIconButton = styled(IconButton)({
  color: "#d32f2f", // Red color for delete icon
});

const YellowIconButton = styled(IconButton)({
  color: "#fbc02d", // Yellow color for edit icon
});

// Styled component for table header
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // Blue color for header
}));

const ProductTable: React.FC<ProductTableProps> = memo(
  ({ products, onDeleteProduct, onEditProduct }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());

    const paginatedProducts = useMemo(() => {
      return products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [products, page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleRowClick = (productId: number) => {
      setSelectedProductIds((prevSelectedProductIds) => {
        const newSelectedProductIds = new Set(prevSelectedProductIds);
        if (newSelectedProductIds.has(productId)) {
          newSelectedProductIds.delete(productId);
        } else {
          newSelectedProductIds.add(productId);
        }
        return newSelectedProductIds;
      });
    };

    const isRowSelected = (productId: number) => selectedProductIds.has(productId);

    return (
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              {!isSmallScreen && (
                <>
                  <TableCell>
                    <TableSortLabel>Référence</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Description</TableSortLabel>
                  </TableCell>
                </>
              )}
              <TableCell>
                <TableSortLabel>Quantité</TableSortLabel>
              </TableCell>
              {!isSmallScreen && (
                <>
                  <TableCell>
                    <TableSortLabel>Prix</TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel>Prix fournisseur</TableSortLabel>
                  </TableCell>
                </>
              )}
              <TableCell>Actions</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <StyledTableRow
                key={product.id}
                hover
                selected={isRowSelected(product.id || 0)}
                onClick={() => handleRowClick(product.id || 0)}
              >
                {!isSmallScreen && <TableCell>{product.reference}</TableCell>}
                {!isSmallScreen && <TableCell>{product.description}</TableCell>}
                <TableCell>{product.quantity}</TableCell>
                {!isSmallScreen && <TableCell>{product.price}</TableCell>}
                {!isSmallScreen && <TableCell>{product.supplierPrice}</TableCell>}
                <TableCell>
                  <RedIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProduct(product);
                    }}
                  >
                    <Delete />
                  </RedIconButton>
                  <YellowIconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product);
                    }}
                  >
                    <Edit />
                  </YellowIconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    );
  }
);

export default ProductTable;
