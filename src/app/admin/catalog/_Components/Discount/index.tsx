import {
  Button,
  Input,
  Modal,
  Pagination,
  Select,
  Table,
} from "@/components/ui/heroui";
import { Section } from "@/components/ui/Section";
import TableAction from "@/components/ui/Table/Action";
import TableTitle from "@/components/ui/Table/Title";
import { useCatalog } from "@/hooks/store/catalog";
import { useDiscount } from "@/stores/useDiscount";
import usePagination from "@/stores/usePagination";
import { presetPagination } from "../../../../../../lib/types/pagination";
import {
  Autocomplete,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  AutocompleteItem,
  RadioGroup,
  Radio,
  Spinner,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useDebounce } from "use-debounce";

const DiscountPage = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loadPage, setLoadPage] = useState(true);
  const {
    loading: loadingDiscount,
    list: listDiscount,
    getAll: getAllDiscount,
    setModel,
    create,
    remove,
    model,
  } = useDiscount();
  const { data } = useCatalog();

  const {
    search,
    setSearch,
    page,
    setPage,
    totalData,
    setList,
    filteredList,
    filter,
    setPageSize,
    pageSize,
  } = usePagination();
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setLoadPage(false);
    getAllDiscount();
    setList(listDiscount);
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      filter((item) =>
        item.code.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    } else {
      setList(listDiscount);
    }
  }, [debouncedSearch, listDiscount]);

  return (
    <div className="flex flex-col gap-4">
      <Section className="px-4 py-3 space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <TableTitle title="Voucher" description="List of Voucher" />
          <div className="flex flex-row items-center gap-2">
            <Input
              type="text"
              placeholder="Search"
              startContent={<FaSearch className="text-primary" />}
              value={search}
              onValueChange={(e) => setSearch(e)}
            />
            <Button
              onPress={() => {
                setModel({ code: "", amount: 0, catalog: "" });
                onOpen();
              }}
              color="primary"
              startContent={<FaPlus />}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <p className="text-xs">
              Total&nbsp;<span className="font-semibold">{totalData}</span>
              &nbsp;Voucher
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs">Showing</span>
              <Select
                disallowEmptySelection
                size="xs"
                variant="bordered"
                classNames={{ trigger: "bg-default-50" }}
                className="w-20"
                selectedKeys={[pageSize.toString()]}
                onSelectionChange={(keys) => {
                  const size = Number(Array.from(keys)[0]);
                  setPageSize(size);
                }}
                items={presetPagination}
              >
                {(item: any) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                )}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 md:gap-4">
            <Table aria-label="Voucher table" color="primary">
              <TableHeader>
                <TableColumn>Voucher</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Catalog</TableColumn>
                <TableColumn>Limit</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn className="flex justify-center items-center">
                  Action
                </TableColumn>
              </TableHeader>
              <TableBody
                isLoading={loadingDiscount}
                loadingContent={<Spinner label="Loading..." />}
              >
                {!loadingDiscount ? (
                  filteredList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>
                        {item.catalog?.name || "Untuk Semua Catalog"}
                      </TableCell>
                      <TableCell>{item.limit}</TableCell>
                      <TableCell>
                        {item.is_per_user ? "Per User" : "Per Voucher"}
                      </TableCell>
                      <TableCell className="flex flex-row justify-center items-center gap-2">
                        <TableAction
                          onUpdate={() => {
                            setModel(item);
                            onOpen();
                          }}
                          onDelete={() => remove(item.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Pagination
            loop
            showControls
            initialPage={1}
            page={page}
            total={Math.ceil(totalData / pageSize)}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      </Section>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Voucher</ModalHeader>
              <ModalBody>
                <Input
                  label="Code"
                  type="text"
                  value={model?.code}
                  onValueChange={(e) => setModel({ ...model, code: e })}
                />
                <Input
                  label="Amount"
                  type="number"
                  value={model?.amount?.toString() ?? ""}
                  onValueChange={(e) =>
                    setModel({ ...model, amount: Number(e) })
                  }
                />
                <Autocomplete
                  label="Catalog"
                  variant="bordered"
                  color="primary"
                  selectedKey={model?.catalog?.id || ""}
                  onSelectionChange={(e) => setModel({ ...model, catalog: e })}
                >
                  {data?.map((catalog: any) => (
                    <AutocompleteItem key={catalog.id}>
                      {catalog.name}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
                <Input
                  label="limit"
                  type="number"
                  value={model?.limit?.toString() ?? ""}
                  onValueChange={(e) =>
                    setModel({ ...model, limit: Number(e) })
                  }
                />
                <div className="flex flex-row gap-2 items-center">
                  Untuk Semua Orang?
                  <RadioGroup
                    value={model?.is_per_user ? "Ya" : "Tidak"}
                    onChange={(event) => {
                      const value = event.target ? event.target.value : event;
                      setModel({ ...model, is_per_user: value === "Ya" });
                    }}
                    orientation="horizontal"
                  >
                    <Radio value="Ya">Ya</Radio>
                    <Radio value="Tidak">Tidak</Radio>
                  </RadioGroup>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Close</Button>
                <Button
                  type="submit"
                  color="primary"
                  onPress={() => {
                    // Ensure catalog is a valid ID or null
                    const payload = {
                      ...model,
                      catalog:
                        typeof model.catalog === "object"
                          ? model.catalog?.id || null
                          : model.catalog || null,
                    };
                    setModel(payload);
                    create();
                    onClose();
                  }}
                >
                  {model?.id ? "Update" : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DiscountPage;
