import React, { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { cn } from "@/lib/utils";
import ErrorPopup from "./ErrorPopup.jsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // Import styles for the phone input
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AutoComplete } from "@/components/ui/autocomplete";
import Autocompeleteadd from "@/customComponents/Autocompleteadd/Autocompleteadd";
const formSchema = z.object({
  receipt_type_id: z.coerce.number().min(1, "Receipt Type field is required"),
  receipt_date: z.string().min(1, "Receipt date field is required"),
  // name: z
  //   .string()
  //   .max(100, "Name must not exceed 100 characters.")
  //   .refine((val) => val === "" || /^[A-Za-z\s\u0900-\u097F]+$/.test(val), {
  //     message: "Name can only contain letters.",
  //   })
  //   // .max(10, "Name cannot exceed 10 characters.")
  //   .optional(),
  name: z
    .string()
    .min(1, "Name cannot be left blank.") // Ensuring minimum length of 2
    .max(100, "Name must not exceed 100 characters.")
    .refine((val) => /^[A-Za-z\s\u0900-\u097F]+$/.test(val), {
      message: "Name can only contain letters.",
    }),

  receipt_head: z.string().min(2, "Receipt head field is required"),
  gotra: z
    .string()
    .max(100, "Gotra must not exceed 100 characters.")
    .refine((val) => val === "" || /^[A-Za-z\s\u0900-\u097F]+$/.test(val), {
      message: "Gotra can only contain letters.",
    })
    .optional(),

  amount: z.coerce.number().optional(),
  quantity: z.coerce.number().optional(),
  rate: z.coerce.number().optional(),
  // email: z.string().optional(),
  email: z
    .string()
    .max(100, "Name must not exceed 100 characters.")
    .email("Invalid email address.")
    .optional()
    .nullable(),
  special_date: z.string().optional(),
  payment_mode: z.string().min(1, "Payment Mode field is required"),
  // mobile: z
  //   .string()
  //   .refine((val) => val === "" || /^[0-9]{10}$/.test(val), {
  //     message: "Mobile number must contain exactly 10 digits.",
  //   })
  //   .optional(),
  mobile: z.string().refine((val) => /^[0-9]{10}$/.test(val), {
    message: "Mobile number must contain exact 10 digits.",
  }),

  // pincode: z.coerce.string().optional(),
  pincode: z
    .string()
    .refine((val) => val === "" || /^\d{6}$/.test(val), {
      message: "Pincode must be of 6 digits.",
    })
    .optional(),
  address: z
    .string()
    .max(250, "Address must not exceed 250 characters.")
    .optional(),
  narration: z
    .string()
    .max(250, "Narration must not exceed 250 characters.")
    .optional(),
  cheque_date: z.string().optional(),
  cheque_number: z.coerce.string().optional(),
  upi_number: z
    .string()
    .max(50, "UTR number must not exceed 50 characters.")
    // .regex(
    //   /^[a-zA-Z0-9]*$/,
    //   'UPI number must only contain alphanumeric characters.'
    // ) // Regex for alphanumeric validation
    .optional(),

  bank_details: z
    .string()
    .max(250, "Bank detail must not exceed 250 characters.")
    .optional(),
  remembrance: z
    .string()
    .max(250, "Remembrance must not exceed 250 characters.")
    .optional(),
  description: z.string().optional(),
  saree_draping_date_morning: z.string().optional(),
  saree_draping_date_evening: z.string().optional(),
  return_saree: z.coerce.number().min(0, "return saree field is required"),
  uparane_draping_date_morning: z.string().optional(),
  uparane_draping_date_evening: z.string().optional(),
  return_uparane: z.coerce.number().min(0, "return Uparane field is required"),
  member_name: z
    .string()
    .max(100, "Member Name must not exceed 100 characters.")
    .optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  // from_time: z
  //   .object({
  //     hour: z.number().min(0).max(23), // Example for hours (0-23)
  //     minute: z.number().min(0).max(59), // Example for minutes (0-59)
  //   })
  //   .optional(), // Optional field
  // to_time: z
  //   .object({
  //     hour: z.number().min(0).max(23), // Example for hours (0-23)
  //     minute: z.number().min(0).max(59), // Example for minutes (0-59)
  //   })
  //   .optional(), // Optional field
  from_time: z
    .union([
      z
        .object({
          hour: z.number().min(0).max(23), // Example for hours (0-23)
          minute: z.number().min(0).max(59), // Example for minutes (0-59)
        })
        .optional(), // Optional object
      z.string().optional(), // Allow a string as an alternative
    ])
    .optional(), // Optional field
  to_time: z
    .union([
      z
        .object({
          hour: z.number().min(0).max(23), // Example for hours (0-23)
          minute: z.number().min(0).max(59), // Example for minutes (0-59)
        })
        .optional(), // Optional object
      z.string().optional(), // Allow a string as an alternative
    ])
    .optional(), // Optional field
  Mallakhamb: z.coerce.number().min(0, "mallakhamb field is required"),
  zanj: z.coerce.number().min(0, "zanj field is required"),
  dhol: z.coerce.number().min(0, "dhol field is required"),
  lezim: z.coerce.number().min(0, "lezim field is required"),
  hall: z.string().optional(),
  membership_no: z
    .string()
    .max(100, "Membership no. must not exceed 100 characters.")
    .optional(),
  timing: z
    .string()
    .max(100, "Timing field must not exceed 100 characters.")
    .optional(),
  guruji: z.string().optional(),
  yajman: z
    .string()
    .max(100, "Yajman field must not exceed 100 characters.")
    .optional(),
  // karma_number: z.string().optional(),
  karma_number: z.coerce
    .number()
    .max(99, "karma number must be at most 2 digits.")
    .optional(),
  day_9: z.coerce.number().min(0, "day 9 field is required"),
  day_10: z.coerce.number().min(0, "day 10 field is required"),
  day_11: z.coerce.number().min(0, "day 11 field is required"),
  day_12: z.coerce.number().min(0, "day 12 field is required"),
  day_13: z.coerce.number().min(0, "day 13 field is required"),
  date: z.string().optional(),
  pooja_type_id: z.coerce.number().optional(),
  day_9_date: z.string().optional(),
  day_10_date: z.string().optional(),
  day_11_date: z.string().optional(),
  day_12_date: z.string().optional(),
  day_13_date: z.string().optional(),
  ac_charges: z.coerce.number().min(0, "ac charges is required"),
  ac_amount: z.coerce.number().optional(),
});

const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openReceiptHead, setOpenReceiptHead] = useState(false);
  const [openReceiptType, setOpenReceiptType] = useState(false);
  const [openPoojaType, setOpenPoojaType] = useState(false);
  const [selectedReceiptHead, setSelectedReceiptHead] = useState("");
  const [selectedReceiptTypeId, setSelectedReceiptTypeId] = useState("");
  const [selectedPoojaTypeId, setSelectedPoojaTypeId] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [selectedAnteshtiId, setSelectedAnteshtiId] = useState(false);
  const [selectedShradhhId, setSelectedShradhhId] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [values, setValues] = useState([]);
  const [takeinput, setTakeinput] = useState();
  const [inputvaluearray, setInputvaluearray] = useState({});
  const [showRemembrance, setShowRemembrance] = useState("");
  const [showSpecialDate, setShowSpecialDate] = useState("");
  const [showPooja, setShowPooja] = useState("");
  const [anteshteeAmounts, setAnteshteeAmounts] = useState({
    day_9_amount: 0,
    day_10_amount: 0,
    day_11_amount: 0,
    day_12_amount: 0,
    day_13_amount: 0,
  });
  const [hallErrorMessage, setHallErrorMessage] = useState(""); // state to handle the error message

  // const mobileInputRef = useRef(null);

  const khatReceiptId = 1;
  const naralReceiptId = 2;
  const bhangarReceiptId = 3;
  const sareeReceiptId = 4;
  const uparaneReceiptId = 5;
  const vasturupeeReceiptId = 6;
  const campReceiptId = 7;
  const libraryReceiptId = 8;
  const hallReceiptId = 9;
  const studyRoomReceiptId = 10;
  const anteshteeReceiptId = 11;
  const poojaReceiptId = 12;
  const poojaPavtiAnekReceiptId = 13;
  const bharani_shradhhId = 14;

  const frameworks = {
    hallName: [
      { value: "लंबोदर १०२", label: "लंबोदर १०२" },
      { value: "ओंकार १०४", label: "ओंकार १०४" },
      { value: "विनायक २०१", label: "विनायक २०१" },
      { value: "ववरद २०२", label: "वरद २०२" },
      { value: "वक्रतुंड ३०१", label: "वक्रतुंड ३०१" },
      { value: "विघ्नहर्ता ४०१", label: "विघ्नहर्ता ४०१" },
    ],
  };

  useEffect(() => {
    if (takeinput !== values?.value) {
      setValues(takeinput);

      setValue("companyName", takeinput);
    }
  }, [takeinput]);

  const queryClient = useQueryClient();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const currentDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const defaultValues = {
    receipt_type_id: "",
    receipt_date: currentDate,
    name: "",
    gotra: "",
    amount: "",
    receipt_head: "",
    quantity: "",
    rate: "",
    email: null,
    mobile: "",
    address: "",
    narration: "",
    pincode: "",
    payment_mode: "",
    special_date: "",
    cheque_date: "",
    cheque_number: "",
    bank_details: "",
    remembrance: "",
    description: "",
    saree_draping_date_morning: "",
    saree_draping_date_evening: "",
    return_saree: "",
    uparane_draping_date_morning: "",
    uparane_draping_date_evening: "",
    return_uparane: "",
    member_name: "",
    from_date: "",
    to_date: "",
    Mallakhamb: "",
    zanj: "",
    lezim: "",
    dhol: "",
    hall: "",
    membership_no: "",
    timing: "",
    guruji: "",
    yajman: "",
    from_date: "",
    to_date: "",
    day_9: "",
    day_10: "",
    day_11: "",
    day_12: "",
    day_13: "",
    pooja_type_id: "",
    date: "",
    upi_number: "",
    from_time: "",
    to_time: "",
    day_9_date: "",
    day_10_date: "",
    day_11_date: "",
    day_12_date: "",
    day_13_date: "",
    ac_charges: "",
    ac_amount: "0.00",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(formSchema), defaultValues });
  const day9Checked = watch("day_9", false);
  const day10Checked = watch("day_10", false);
  const day11Checked = watch("day_11", false);
  const day12Checked = watch("day_12", false);
  const day13Checked = watch("day_13", false);
  const acChargesChecked = watch("ac_charges", false);

  const {
    data: allPoojaTypesData,
    isLoading: isAllPoojaTypesDataLoading,
    isError: isAllPoojaTypesDataError,
  } = useQuery({
    queryKey: ["allPoojaTypes"], // This is the query key
    queryFn: async () => {
      try {
        // if (!selectedReceiptTypeId === 12) {
        //   return [];
        // }
        const response = await axios.get(`/api/all_pooja_types`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    // enabled: selectedReceiptTypeId === 12, // Enable the query only if selectedReceiptTypeId is 4
  });

  const {
    data: allPoojaTypesMultipleData,
    isLoading: isAllPoojaTypesDataMultipleLoading,
    isError: isAllPoojaTypesDataMultipleError,
  } = useQuery({
    queryKey: ["allPoojaTypesMultiple"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/all_pooja_types_multiple`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const {
    data: allReceiptTypesData,
    isLoading: isAllReceiptTypesDataLoading,
    isError: isAllReceiptTypesDataError,
  } = useQuery({
    queryKey: ["allReceiptTypes", selectedReceiptHead], // This is the query key
    queryFn: async () => {
      try {
        if (selectedReceiptHead) {
          setValue("receipt_type_id", "");
          handleReceiptTypeChange("");
        }
        const response = await axios.get(`/api/all_receipt_types`, {
          params: { receipt_head: selectedReceiptHead },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    keepPreviousData: true, // Keep previous data until the new data is available
  });

  // pooja dates
  const {
    data: poojaDatesData,
    isLoading: isPoojaDatesDataLoading,
    isError: isPoojaDatesDataError,
  } = useQuery({
    queryKey: ["showPoojaDate", selectedPoojaTypeId], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedPoojaTypeId) {
          return [];
        }
        const response = await axios.get(
          `/api/show_pooja_dates/${selectedPoojaTypeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!selectedPoojaTypeId, // Enable the query only if selectedPoojaTypeId is truthy
  });

  // end pooja dates
  //  function for date checkbox
  // const handleCheckboxChange = (e, poojaDate) => {
  //   if (e.target.checked) {
  //     setSelectedDates((prevDates) => [...prevDates, poojaDate]);
  //   } else {
  //     setSelectedDates((prevDates) =>
  //       prevDates.filter((date) => date !== poojaDate)
  //     );
  //   }
  // };

  const handleCheckboxChange = (e, poojaDate) => {
    if (e.target.checked) {
      // Add the date to the selectedDates array
      setSelectedDates((prevDates) => {
        const updatedDates = [...prevDates, poojaDate];
        updateAmount(updatedDates.length); // Update amount whenever dates change
        return updatedDates;
      });
    } else {
      // Remove the date from the selectedDates array
      setSelectedDates((prevDates) => {
        const updatedDates = prevDates.filter((date) => date !== poojaDate);
        updateAmount(updatedDates.length); // Update amount whenever dates change
        return updatedDates;
      });
    }
  };

  const handleSelectAllChange = () => {
    if (selectAllCheckbox) {
      // If Select All is already checked, uncheck all checkboxes and set empty array
      setSelectedDates([]);
      updateAmount(0);
    } else {
      // If Select All is unchecked, check all checkboxes
      const allDates = poojaDatesData?.PoojaDates.map(
        (poojaDate) => poojaDate.pooja_date
      );
      setSelectedDates(allDates);
      updateAmount(allDates.length);
    }
    setSelectAllCheckbox(!selectAllCheckbox);
  };

  // Update amount for date checkboxes
  const updateAmount = (numOfDates) => {
    numOfDates = parseFloat(numOfDates);
    const newAmount = parseFloat(numOfDates * parseFloat(51)).toFixed(2);
    setValue("amount", parseFloat(newAmount).toFixed(2));
  };

  // guruji data
  const {
    data: AllGurujisData,
    isLoading: isAllGurujisDataLoading,
    isError: isAllGurujisDataError,
  } = useQuery({
    queryKey: ["allGurijis"], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedAnteshtiId && !selectedShradhhId) {
          return [];
        }
        const response = await axios.get(`/api/all_gurujis`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!selectedAnteshtiId || !!selectedShradhhId, // Enable the query only if selectedPoojaTypeId is truthy
  });

  const {
    data: allReceiptHeadsData,
    isLoading: isAllReceiptHeadsDataLoading,
    isError: isAllReceiptHeadsDataError,
  } = useQuery({
    queryKey: ["allReceiptHeads"], // This is the query key
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/all_receipt_heads`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    keepPreviousData: true, // Keep previous data until the new data is available
  });

  // sareeDate
  const {
    data: sareeDateData,
    isLoading: isSareeDateDataLoading,
    isError: isSareeDateDataError,
  } = useQuery({
    queryKey: ["sareeDate"], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedReceiptTypeId === 4) {
          return [];
        }
        const response = await axios.get(`/api/saree_date`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: selectedReceiptTypeId === 4, // Enable the query only if selectedReceiptTypeId is 4
  });

  // uparaneDate
  const {
    data: uparaneDateData,
    isLoading: isUparaneDateDataLoading,
    isError: isUparaneDateDataError,
  } = useQuery({
    queryKey: ["uparaneDate"], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedReceiptTypeId === 5) {
          return [];
        }
        const response = await axios.get(`/api/uparane_date`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: selectedReceiptTypeId === 5, // Enable the query only if selectedReceiptTypeId is 4
  });

  // sareeDate
  const {
    data: sareeEveningDateData,
    isLoading: isSareeEveningDateDataLoading,
    isError: isSareeEveningDateDataError,
  } = useQuery({
    queryKey: ["sareeEveningDate"], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedReceiptTypeId === 4) {
          return [];
        }
        const response = await axios.get(`/api/saree_date_evening`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: selectedReceiptTypeId === 4, // Enable the query only if selectedReceiptTypeId is 4
  });

  // UparaneEveningDate
  const {
    data: uparaneEveningDateData,
    isLoading: isUparaneEveningDateDataLoading,
    isError: isUparaneEveningDateDataError,
  } = useQuery({
    queryKey: ["uparaneEveningDate"], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedReceiptTypeId === 5) {
          return [];
        }
        const response = await axios.get(`/api/uparane_date_evening`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: selectedReceiptTypeId === 5, // Enable the query only if selectedReceiptTypeId is 4
  });

  // anteshtee date amounts
  const {
    data: anteshteeAmountDateData,
    isLoading: isAnteshteeAmountDateDataLoading,
    isError: isAnteshteeAmountDateDataError,
  } = useQuery({
    queryKey: ["showAnteshtiAmountDate"], // This is the query key
    queryFn: async () => {
      try {
        if (!selectedReceiptTypeId === anteshteeReceiptId) {
          return [];
        }
        const response = await axios.get(`/api/anteshtee_dates/1`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data?.data; // Return the fetched data
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: selectedReceiptTypeId === anteshteeReceiptId,
    keepPreviousData: true, // Enable the query only if selectedReceiptTypeId is 4
  });

  useEffect(() => {
    if (anteshteeAmountDateData?.AnteshteeDate) {
      const { AnteshteeDate } = anteshteeAmountDateData;
      setAnteshteeAmounts({
        day_9_amount: parseFloat(AnteshteeDate.day_9_amount),
        day_10_amount: parseFloat(AnteshteeDate.day_10_amount),
        day_11_amount: parseFloat(AnteshteeDate.day_11_amount),
        day_12_amount: parseFloat(AnteshteeDate.day_12_amount),
        day_13_amount: parseFloat(AnteshteeDate.day_13_amount),
      });
    }
  }, [anteshteeAmountDateData]);

  useEffect(() => {
    if (sareeDateData) {
      // setValue("saree_dsraping_date", sareeDateData?.SareeDrapingDate);
      setValue(
        "saree_draping_date_morning",
        sareeDateData?.SareeDrapingDateMorning
      );
    }
  }, [sareeDateData, selectedReceiptTypeId]);

  useEffect(() => {
    if (sareeEveningDateData) {
      setValue(
        "saree_draping_date_evening",
        sareeEveningDateData?.SareeDrapingDateEvening
      );
    }
  }, [sareeEveningDateData, selectedReceiptTypeId]);

  useEffect(() => {
    if (uparaneDateData) {
      // setValue("saree_dsraping_date", sareeDateData?.SareeDrapingDate);
      const dateFormatted = new Date(uparaneDateData?.UparaneDrapingDate)
        .toISOString()
        .split("T")[0];
      setValue(
        "uparane_draping_date_morning",
        uparaneDateData?.UparaneDrapingDate
      );
    }
  }, [uparaneDateData, selectedReceiptTypeId]);

  useEffect(() => {
    if (uparaneEveningDateData) {
      setValue(
        "uparane_draping_date_evening",
        uparaneEveningDateData?.UparaneDrapingDateEvening
      );
    }
  }, [uparaneEveningDateData, selectedReceiptTypeId]);

  const storeMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/receipts", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the Bearer token
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("receipts");
      queryClient.invalidateQueries("dashboards");
      toast.success("Receipt Added Successfully");
      setIsLoading(false);
      navigate("/receipts");
    },
    onError: (error) => {
      setIsLoading(false);
      if (error.response && error.response.data.errors) {
        const serverStatus = error.response.data.status;
        const serverErrors = error.response.data.errors;
        if (serverStatus === false) {
          if (serverErrors.quantity) {
            setError("quantity", {
              type: "manual",
              message: serverErrors.quantity[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.rate) {
            setError("rate", {
              type: "manual",
              message: serverErrors.rate[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.hall_booked) {
            // toast.error(serverErrors.hall_booked[0]);
            setHallErrorMessage(serverErrors.hall_booked[0]);
          }
          if (serverErrors.hall) {
            setError("hall", {
              type: "manual",
              message: serverErrors.hall[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.saree_draping_date_morning) {
            setError("saree_draping_date_morning", {
              type: "manual",
              message: serverErrors.saree_draping_date_morning[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.saree_draping_date_evening) {
            setError("saree_draping_date_evening", {
              type: "manual",
              message: serverErrors.saree_draping_date_evening[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.bank_details) {
            setError("bank_details", {
              type: "manual",
              message: serverErrors.bank_details[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.cheque_number) {
            setError("cheque_number", {
              type: "manual",
              message: serverErrors.cheque_number[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.cheque_date) {
            setError("cheque_date", {
              type: "manual",
              message: serverErrors.cheque_date[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.upi_number) {
            setError("upi_number", {
              type: "manual",
              message: serverErrors.upi_number[0], // The error message from the server
            });
            // toast.error("The poo has already been taken.");
          }
          if (serverErrors.uparane_draping_date_morning) {
            setError("uparane_draping_date_morning", {
              type: "manual",
              message: serverErrors.uparane_draping_date_morning[0], // The error message from the server
            });
          }
          if (serverErrors.uparane_draping_date_evening) {
            setError("uparane_draping_date_evening", {
              type: "manual",
              message: serverErrors.uparane_draping_date_evening[0], // The error message from the server
            });
          }
          if (serverErrors.saree_days) {
            toast.error("Date field is required.");
          }
          if (serverErrors.uparane_days) {
            toast.error("Date field is required.");
          }
          if (serverErrors.pooja_type_id) {
            setError("pooja_type_id", {
              type: "manual",
              message: serverErrors.pooja_type_id[0],
            });
          }
          if (serverErrors.date) {
            setError("date", {
              type: "manual",
              message: serverErrors.date[0],
            });
          }
          if (serverErrors.gotra) {
            setError("gotra", {
              type: "manual",
              message: serverErrors.gotra[0],
            });
            toast.error("Gotra field is required.");
          }
          if (serverErrors.multiple_dates) {
            toast.error("Date field is required");
          }
          if (serverErrors.description) {
            setError("description", {
              type: "manual",
              message: serverErrors.description[0],
            });
          }
          if (serverErrors.special_date) {
            setError("special_date", {
              type: "manual",
              message: serverErrors.special_date[0],
            });
            toast.error("Special Date field is required.");
          }
          if (serverErrors.from_time) {
            setError("from_time", {
              type: "manual",
              message: serverErrors.from_time[0],
            });
          }
          if (serverErrors.to_time) {
            setError("to_time", {
              type: "manual",
              message: serverErrors.to_time[0],
            });
          }
          if (serverErrors.guruji) {
            setError("guruji", {
              type: "manual",
              message: serverErrors.guruji[0],
            });
          }
          if (serverErrors.yajman) {
            setError("yajman", {
              type: "manual",
              message: serverErrors.yajman[0],
            });
          }
          if (serverErrors.karma_number) {
            setError("karma_number", {
              type: "manual",
              message: serverErrors.karma_number[0],
            });
          }
          if (serverErrors.anteshti_dates) {
            toast.error("Date field is required.");
          }
          if (serverErrors.amount) {
            setError("amount", {
              type: "manual",
              message: serverErrors.amount[0],
            });
          }
        } else {
          toast.error("Failed to add Receipt.");
        }
      } else {
        toast.error("Failed to add Receipt.");
      }
    },
  });
  const handleClosePopup = () => {
    setHallErrorMessage(""); // Close the popup by clearing the error message
  };
  // Function to set the cursor position
  // const setCursorToEnd = () => {
  //   const input = mobileInputRef.current;
  //   if (input) {
  //     // Set the cursor position to start right after the `+91`
  //     input.setSelectionRange(3, 3); // 3 is the length of +91
  //   }
  // };
  const onSubmit = (data) => {
    setIsLoading(true);

    // if (data.mobile && data.mobile.length <= 3) {
    //   // Checking if it's only the country code
    //   data.mobile = ""; // Set the mobile to an empty string if only country code is entered
    // }

    if (!data.ac_charges) {
      data.ac_amount = "";
    }
    if (!data.day_9) {
      data.day_9_date = "";
    }
    if (!data.day_10) {
      data.day_10_date = "";
    }
    if (!data.day_11) {
      data.day_11_date = "";
    }
    if (!data.day_12) {
      data.day_12_date = "";
    }
    if (!data.day_13) {
      data.day_13_date = "";
    }
    const payload = {
      ...data, // existing form data
      multiple_dates: selectedDates, // your array of selected dates
    };
    storeMutation.mutate(payload);
  };

  const handleReceiptTypeChange = (value) => {
    setSelectedReceiptTypeId(value?.id);
    // setValue("amount", value?.minimum_amount);
    setValue("amount", value?.minimum_amount || null);
    setValue("special_date", value?.special_date || "");
    if (value?.id === 11) {
      setSelectedAnteshtiId(true);
    }

    if (value?.id === 14) {
      setSelectedShradhhId(true);
    }
  };

  const receiptAmount = watch(["quantity", "rate"]);
  useEffect(() => {
    const quantity = parseFloat(receiptAmount[0]) || 0;
    const rate = parseFloat(receiptAmount[1]) || 0;
    if (quantity && rate) {
      const totalAmount = (quantity * rate).toFixed(2); // Multiply instead of adding
      setValue("amount", totalAmount);
    }
  }, [receiptAmount, setValue]);

  // ac amount change function
  const handleAcAmountChange = (e) => {
    const acAmount = parseFloat(e.target.value) || 0.0;
    const currentAmount = parseFloat(watch("amount")) || 0.0;
    const newAmount = (currentAmount + acAmount).toFixed(2); // Adjust decimal precision
    setValue("amount", newAmount); // Update the form value
  };

  // const handleAnteshteeCheckboxChange = (e, amountToAdd) => {
  //   const { checked } = e.target; // Get the state of the checkbox (checked or unchecked)
  //   const currentAmount = parseFloat(watch("amount")) || 0; // Get the current amount

  //   // Add or subtract 500 based on whether the checkbox is checked or unchecked
  //   const newAmount = checked
  //     ? currentAmount + amountToAdd
  //     : currentAmount - amountToAdd;

  //   // Update the "amount" field in the form
  //   setValue("amount", newAmount);
  // };
  const handleAnteshteeCheckboxChange = (e, dayAmountKey) => {
    const { checked } = e.target; // Get the state of the checkbox (checked or unchecked)
    const currentAmount = parseFloat(watch("amount")) || 0.0; // Get the current amount

    // Get the amount for the selected day (e.g., day_9_amount, day_10_amount, etc.)
    const amountToAdd = parseFloat(anteshteeAmounts[dayAmountKey]);

    // Add or subtract the fetched amount based on whether the checkbox is checked or unchecked
    const newAmount = checked
      ? currentAmount + amountToAdd
      : currentAmount - amountToAdd;

    // Update the "amount" field in the form
    // setValue("amount", parseFloat(newAmount));
    setValue("amount", newAmount.toFixed(2));
  };

  console.log(showRemembrance);
  return (
    <>
      <ErrorPopup errorMessage={hallErrorMessage} onClose={handleClosePopup} />

      <div className="p-5">
        {/* breadcrumb start */}
        <div className=" mb-7 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="">
              <Button
                onClick={() => navigate("/receipts")}
                className="p-0 text-blue-700 text-sm font-light"
                variant="link"
              >
                Receipts
              </Button>
            </span>
            <span className="text-gray-400">/</span>
            <span className="dark:text-gray-300">Add</span>
          </div>
        </div>
        {/* breadcrumb ends */}

        {/* form style strat */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 pb-4 mb-5 dark:bg-background pt-1 w-full bg-white shadow-lg border  rounded-md">
            <div className="w-full py-3 flex justify-start items-center">
              <h2 className="text-lg  font-normal">Receipts Details</h2>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="receipt_no">
                  Receipt Number: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="receipt_no"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="receipt_no"
                      className="dark:bg-[var(--foreground)] mt-1 bg-gray-100"
                      type="text"
                      readOnly
                      // disabled="true"
                      placeholder=""
                    />
                  )}
                />
                {errors.receipt_no && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.receipt_no.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="receipt_date">
                  Receipt date:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="receipt_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="receipt_date"
                      className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1 bg-gray-100"
                      type="date"
                      readOnly
                      placeholder="Enter receipt date"
                    />
                  )}
                />
                {errors.receipt_date && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.receipt_date.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="receipt_head">
                  Receipt Head: <span className="text-red-500">*</span>
                </Label>
                {/* <Controller
                  name="receipt_head"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedReceiptHead(value); // Set the selected receipt head
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select receipt head" />
                      </SelectTrigger>
                      <SelectContent className="pb-10">
                        <SelectGroup>
                          <SelectLabel>Select receipt head</SelectLabel>
                          {allReceiptHeadsData?.ReceiptHeads &&
                            Object.keys(allReceiptHeadsData?.ReceiptHeads).map(
                              (key) => (
                                <SelectItem key={key} value={key}>
                                  {allReceiptHeadsData.ReceiptHeads[key]}
                                </SelectItem>
                              )
                            )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                /> */}
                {/* <div className="w-full pt-1"> */}
                <Controller
                  name="receipt_head"
                  control={control}
                  render={({ field }) => (
                    <Popover
                      open={openReceiptHead}
                      onOpenChange={setOpenReceiptHead}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openReceiptHead ? "true" : "false"} // This should depend on the popover state
                          className=" w-[325px] justify-between mt-1"
                          onClick={() => setOpenReceiptHead((prev) => !prev)} // Toggle popover on button click
                        >
                          {field.value
                            ? Object.keys(
                                allReceiptHeadsData?.ReceiptHeads
                              ).find((key) => key === field.value)
                            : "Select Receipt Head..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[325px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search receipt head..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No receipt head found.</CommandEmpty>
                            <CommandGroup>
                              {allReceiptHeadsData?.ReceiptHeads &&
                                Object.keys(
                                  allReceiptHeadsData?.ReceiptHeads
                                ).map((key) => (
                                  <CommandItem
                                    key={key}
                                    value={key}
                                    onSelect={(currentValue) => {
                                      setValue("receipt_head", key);
                                      setSelectedReceiptHead(
                                        currentValue === selectedReceiptHead
                                          ? ""
                                          : currentValue
                                      );
                                      setOpenReceiptHead(false);
                                      // Close popover after selection
                                    }}
                                  >
                                    {key}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        key === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {/* </div> */}
                {errors.receipt_head && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.receipt_head.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="receipt_type_id">
                  Receipt Type: <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="receipt_type_id"
                  control={control}
                  render={({ field }) => (
                    <Popover
                      open={openReceiptType}
                      onOpenChange={setOpenReceiptType}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openReceiptType ? "true" : "false"} // This should depend on the popover state
                          className=" w-[325px] justify-between mt-1"
                          onClick={() => setOpenReceiptType((prev) => !prev)} // Toggle popover on button click
                        >
                          {field.value
                            ? allReceiptTypesData?.ReceiptTypes &&
                              allReceiptTypesData?.ReceiptTypes.find(
                                (receiptType) => receiptType.id === field.value
                              )?.receipt_type
                            : "Select Receipt Type..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[325px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search receipt type..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No receipt type found.</CommandEmpty>
                            <CommandGroup>
                              {allReceiptTypesData?.ReceiptTypes &&
                                allReceiptTypesData?.ReceiptTypes.map(
                                  (receiptType) => (
                                    <CommandItem
                                      key={receiptType.id}
                                      value={receiptType.id}
                                      onSelect={(currentValue) => {
                                        setValue(
                                          "receipt_type_id",
                                          receiptType.id
                                        );
                                        // setSelectedReceiptTypeId(
                                        //   currentValue === selectedReceiptTypeId
                                        //     ? ""
                                        //     : currentValue
                                        // );
                                        setShowRemembrance(
                                          receiptType.show_remembarance
                                        );
                                        setShowSpecialDate(
                                          receiptType.show_special_date
                                        );
                                        setShowPooja(receiptType.is_pooja);
                                        handleReceiptTypeChange(receiptType);
                                        setOpenReceiptType(false);
                                        // Close popover after selection
                                      }}
                                    >
                                      {receiptType.receipt_type}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          receiptType.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  )
                                )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.receipt_type_id && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.receipt_type_id.message}
                  </p>
                )}
              </div>
              <div className="relative md:col-span-2">
                <Label className="font-normal" htmlFor="name">
                  Name:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      className="mt-1"
                      type="text"
                      placeholder="Enter name"
                    />
                  )}
                />
                {errors.name && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative ">
                <Label className="font-normal" htmlFor="gotra">
                  Gotra:
                </Label>
                <Controller
                  name="gotra"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="gotra"
                      className="mt-1"
                      type="text"
                      placeholder="Enter gotra"
                    />
                  )}
                />
                {errors.gotra && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.gotra.message}
                  </p>
                )}
              </div>
              <div className="relative ">
                <Label className="font-normal" htmlFor="email">
                  Email:
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      className="mt-1"
                      type="email"
                      placeholder="Enter email"
                    />
                  )}
                />
                {errors.email && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative ">
                <Label className="font-normal" htmlFor="mobile">
                  Mobile:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="mobile"
                      className="mt-1"
                      type="text"
                      placeholder="Enter mobile"
                      // maxLength={10} // Restrict input to 10 characters
                      // pattern="^[0-9]{10}$" // Only allow exactly 10 digits
                    />
                    // <PhoneInput
                    //   {...field}
                    //   defaultCountry="IN" // Default country for the country code
                    //   // value={mobile}
                    //   // onChange={setMobile}
                    //   id="mobile"
                    //   name="mobile"
                    //   placeholder="Enter mobile number"
                    //   inputStyle={{ minWidth: "17rem" }}
                    //   className="mt-1"
                    // />
                  )}
                />
                {errors.mobile && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-1 gap-7 md:gap-4">
              <div className="relative ">
                <Label className="font-normal" htmlFor="address">
                  Address:
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    // <Textarea
                    //   placeholder="Enter the address..."
                    //   className="resize-none mt-1 "
                    //   {...field}
                    // />
                    <Input
                      {...field}
                      id="address"
                      className="mt-1"
                      type="text"
                      placeholder="Enter the address..."
                    />
                  )}
                />
                {errors.address && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative md:col-span-2">
                <Label className="font-normal" htmlFor="narration">
                  Narration:
                </Label>
                <Controller
                  name="narration"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="narration"
                      className="mt-1"
                      type="text"
                      placeholder="Enter narration"
                    />
                  )}
                />
                {errors.narration && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.narration.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Label className="font-normal" htmlFor="pincode">
                  Pincode:
                </Label>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="pincode"
                      className="mt-1"
                      type="number"
                      placeholder="Enter pincode"
                    />
                  )}
                />
                {errors.pincode && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>

            {showRemembrance || showSpecialDate ? (
              <div className="w-full mb-4  grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                {showRemembrance ? (
                  <div className="relative md:col-span-2">
                    <Label className="font-normal" htmlFor="remembrance">
                      Remembrance:
                    </Label>
                    <Controller
                      name="remembrance"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="remembrance"
                          className="mt-1"
                          type="text"
                          placeholder="Enter remembrance"
                        />
                      )}
                    />
                    {errors.remembrance && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.remembrance.message}
                      </p>
                    )}
                  </div>
                ) : (
                  ""
                )}

                {showSpecialDate ? (
                  <div className="relative">
                    <Label className="font-normal" htmlFor="special_date">
                      Special date:
                    </Label>
                    <Controller
                      name="special_date"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="special_date"
                          className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                          type="date"
                          placeholder="Enter special date"
                        />
                      )}
                    />
                    {errors.special_date && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.special_date.message}
                      </p>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}

            {(selectedReceiptTypeId === bhangarReceiptId ||
              selectedReceiptTypeId === vasturupeeReceiptId) && (
              <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative">
                  <Label className="font-normal" htmlFor="description">
                    description:<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select description" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select description</SelectLabel>
                            {selectedReceiptTypeId === bhangarReceiptId && (
                              <>
                                <SelectItem value="रद्दी पेपर वा पुस्तके">
                                  रद्दी पेपर वा पुस्तके
                                </SelectItem>
                                <SelectItem value="इतर समान">
                                  इतर समान
                                </SelectItem>
                              </>
                            )}
                            {selectedReceiptTypeId === vasturupeeReceiptId && (
                              <>
                                <SelectItem value="पूजा साहित्य">
                                  पूजा साहित्य
                                </SelectItem>
                                <SelectItem value="सोने वा चांदी वस्तू">
                                  सोने वा चांदी वस्तू
                                </SelectItem>
                                <SelectItem value="उपकरणे वा इतर">
                                  उपकरणे वा इतर
                                </SelectItem>
                                <SelectItem value="देवी साडी वा उपरणे">
                                  देवी साडी वा उपरणे
                                </SelectItem>
                              </>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.description && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {paymentMode === "Bank" && (
              <>
                <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                  <div className="relative ">
                    <Label className="font-normal" htmlFor="bank_details">
                      Bank Details:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="bank_details"
                      control={control}
                      render={({ field }) => (
                        // <Textarea
                        //   placeholder="Enter bank details..."
                        //   className="resize-none mt-1 "
                        //   {...field}
                        // />
                        <Input
                          {...field}
                          id="bank_details"
                          className="mt-1"
                          type="text"
                          placeholder="Enter bank details..."
                        />
                      )}
                    />
                    {errors.bank_details && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.bank_details.message}
                      </p>
                    )}
                  </div>
                  <div className="relative ">
                    <Label className="font-normal" htmlFor="cheque_number">
                      Cheque Number:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="cheque_number"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="cheque_number"
                          className="mt-1"
                          type="text"
                          placeholder="Enter cheque number"
                        />
                      )}
                    />
                    {errors.cheque_number && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.cheque_number.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Label className="font-normal" htmlFor="cheque_date">
                      Cheque date:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="cheque_date"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="cheque_date"
                          className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                          type="date"
                          placeholder="Enter cheque date"
                        />
                      )}
                    />
                    {errors.cheque_date && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.cheque_date.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full mb-8 grid grid-cols-1 md:grid-cols-1 gap-7 md:gap-4">
                  <div className="relative "></div>
                </div>
              </>
            )}

            {/* {selectedReceiptTypeId === khatReceiptId && ( */}
            {(selectedReceiptTypeId === khatReceiptId ||
              selectedReceiptTypeId === naralReceiptId) && (
              <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative">
                  <Label className="font-normal" htmlFor="quantity">
                    Quantity: <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="quantity"
                        className="mt-1"
                        type="number"
                        placeholder="Enter quantity"
                      />
                    )}
                  />
                  {errors.quantity && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
                <div className="relative ">
                  <Label className="font-normal" htmlFor="rate">
                    Rate: <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="rate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="rate"
                        className="mt-1"
                        type="text"
                        placeholder="Enter rate"
                      />
                    )}
                  />
                  {errors.rate && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.rate.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === sareeReceiptId && (
              <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative">
                  <Label
                    className="font-normal"
                    htmlFor="saree_draping_date_morning"
                  >
                    Saree Draping date morning:
                  </Label>
                  <Controller
                    name="saree_draping_date_morning"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="saree_draping_date_morning"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter date"
                      />
                    )}
                  />
                  {errors.saree_draping_date_morning && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.saree_draping_date_morning.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label
                    className="font-normal"
                    htmlFor="saree_draping_date_evening"
                  >
                    Saree Draping date evening:
                  </Label>
                  <Controller
                    name="saree_draping_date_evening"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="saree_draping_date_evening"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter date"
                      />
                    )}
                  />
                  {errors.saree_draping_date_evening && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.saree_draping_date_evening.message}
                    </p>
                  )}
                </div>
                <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                  <Controller
                    name="return_saree"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="return_saree"
                        {...field}
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    )}
                  />
                  <Label className="font-normal" htmlFor="return_saree">
                    Return Saree
                  </Label>
                  {errors.return_saree && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.return_saree.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === uparaneReceiptId && (
              <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative">
                  <Label
                    className="font-normal"
                    htmlFor="uparane_draping_date_morning"
                  >
                    Uparane Draping date morning:
                  </Label>
                  <Controller
                    name="uparane_draping_date_morning"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="uparane_draping_date_morning"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter date"
                      />
                    )}
                  />
                  {errors.uparane_draping_date_morning && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.uparane_draping_date_morning.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label
                    className="font-normal"
                    htmlFor="uparane_draping_date_evening"
                  >
                    Uparane Draping date evening:
                  </Label>
                  <Controller
                    name="uparane_draping_date_evening"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="uparane_draping_date_evening"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter date"
                      />
                    )}
                  />
                  {errors.uparane_draping_date_evening && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.uparane_draping_date_evening.message}
                    </p>
                  )}
                </div>
                <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                  <Controller
                    name="return_uparane"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="return_uparane"
                        {...field}
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    )}
                  />
                  <Label className="font-normal" htmlFor="return_uparane">
                    Return Uparane
                  </Label>
                  {errors.return_uparane && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.return_uparane.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === campReceiptId && (
              <div className="w-full hidden grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative ">
                  <Label className="font-normal" htmlFor="member_name">
                    Member Name:
                  </Label>
                  <Controller
                    name="member_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="member_name"
                        className="mt-1"
                        type="text"
                        placeholder="Enter name"
                      />
                    )}
                  />
                  {errors.member_name && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.member_name.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label className="font-normal" htmlFor="from_date">
                    From date:
                  </Label>
                  <Controller
                    name="from_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="from_date"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter from date"
                      />
                    )}
                  />
                  {errors.from_date && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.from_date.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label className="font-normal" htmlFor="to_date">
                    To date:
                  </Label>
                  <Controller
                    name="to_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="to_date"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter to date"
                      />
                    )}
                  />
                  {errors.to_date && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.to_date.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === campReceiptId && (
              <div className="w-full hidden mb-4 grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-4">
                <div className="relative flex gap-2 mt-5 md:mt-0 md:pt-10 md:pl-2 ">
                  <Controller
                    name="Mallakhamb"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="Mallakhamb"
                        {...field}
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    )}
                  />
                  <Label className="font-normal" htmlFor="Mallakhamb">
                    Mallakhamb
                  </Label>
                  {errors.Mallakhamb && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.Mallakhamb.message}
                    </p>
                  )}
                </div>
                <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                  <Controller
                    name="zanj"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="zanj"
                        {...field}
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    )}
                  />
                  <Label className="font-normal" htmlFor="zanj">
                    Zanj
                  </Label>
                  {errors.zanj && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.zanj.message}
                    </p>
                  )}
                </div>
                <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                  <Controller
                    name="dhol"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="dhol"
                        {...field}
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    )}
                  />
                  <Label className="font-normal" htmlFor="dhol">
                    Dhol
                  </Label>
                  {errors.dhol && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.dhol.message}
                    </p>
                  )}
                </div>
                <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                  <Controller
                    name="lezim"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="lezim"
                        {...field}
                        type="checkbox"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                    )}
                  />
                  <Label className="font-normal" htmlFor="lezim">
                    lezim
                  </Label>
                  {errors.lezim && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.lezim.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === hallReceiptId && (
              <div>
                <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                  <div className="relative">
                    <Label className="font-normal" htmlFor="hall">
                      Hall:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="hall"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select hall" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select hall</SelectLabel>
                              <SelectItem value="लंबोदर १०२">
                                लंबोदर १०२
                              </SelectItem>
                              <SelectItem value="ओंकार १०४">
                                ओंकार १०४
                              </SelectItem>
                              <SelectItem value="विनायक २०१">
                                विनायक २०१
                              </SelectItem>
                              <SelectItem value="वरद २०२">वरद २०२</SelectItem>
                              <SelectItem value="वक्रतुंड ३०१">
                                वक्रतुंड ३०१
                              </SelectItem>
                              <SelectItem value="विघ्नहर्ता ४०१">
                                विघ्नहर्ता ४०१
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        //     <Autocompeleteadd
                        //       options={frameworks.hallName}
                        //       placeholder="Select Hall Name..."
                        //       emptyMessage="No Hall Name Found."
                        //       value={values}
                        //       array={inputvaluearray}
                        //       setarray={setInputvaluearray}
                        //       variable="hall"
                        //       onValueChange={(value) => {
                        //         setValues(value);
                        //         setValue("hall", value?.value);
                        //       }}
                        //     />
                      )}
                    />
                    {errors.hall && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.hall.message}
                      </p>
                    )}
                  </div>

                  <div className="relative flex flex-col">
                    <Label
                      className="font-normal mt-2 mb-1"
                      htmlFor="from_time"
                    >
                      From Time: <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="from_time"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          disableDayPicker
                          // value={fromTime}
                          // onChange={handleFromTimeChange}
                          format="hh:mm A"
                          plugins={[<TimePicker position="bottom" />]}
                          {...field}
                          id="from_time"
                          className="mt-1"
                          type="text"
                          placeholder="Enter time"
                          style={{ width: "280px", height: "35px" }} // Inline style for width and height
                        />
                      )}
                    />
                    {errors.from_time && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0 top-15">
                        {errors.from_time.message}
                      </p>
                    )}
                  </div>

                  <div className="relative flex flex-col">
                    <Label className="font-normal mt-2 mb-1" htmlFor="to_time">
                      To Time: <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="to_time"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          disableDayPicker
                          // value={fromTime}
                          // onChange={handleFromTimeChange}
                          format="hh:mm A"
                          plugins={[<TimePicker position="bottom" />]}
                          {...field}
                          id="to_time"
                          className="mt-1"
                          type="text"
                          placeholder="Enter time"
                          style={{ width: "280px", height: "35px" }} // Inline style for width and height
                        />
                      )}
                    />
                    {errors.to_time && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0 top-15">
                        {errors.to_time.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                  <div className="relative flex gap-2 mt-5 md:mt-0 md:pt-10 md:pl-2 ">
                    <Controller
                      name="ac_charges"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="ac_charges"
                          {...field}
                          type="checkbox"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="ac_charges">
                      Ac Charges
                    </Label>
                    {errors.ac_charges && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.ac_charges.message}
                      </p>
                    )}
                  </div>
                  {acChargesChecked && (
                    <div className="relative">
                      <Label className="font-normal" htmlFor="ac_amount">
                        Ac Amount:
                      </Label>
                      <Controller
                        name="ac_amount"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="ac_amount"
                            className="mt-1"
                            type="number"
                            onBlur={(e) => handleAcAmountChange(e)}
                            placeholder="Enter amount"
                          />
                        )}
                      />
                      {errors.ac_amount && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.ac_amount.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {(selectedReceiptTypeId === libraryReceiptId ||
              selectedReceiptTypeId === studyRoomReceiptId) && (
              <div className="w-full hidden mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative ">
                  <Label className="font-normal" htmlFor="membership_no">
                    Membership Number:
                  </Label>
                  <Controller
                    name="membership_no"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="membership_no"
                        className="mt-1"
                        type="text"
                        placeholder="Enter membership no."
                      />
                    )}
                  />
                  {errors.membership_no && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.membership_no.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label className="font-normal" htmlFor="from_date">
                    From date:
                  </Label>
                  <Controller
                    name="from_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="from_date"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter from date"
                      />
                    )}
                  />
                  {errors.from_date && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.from_date.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label className="font-normal" htmlFor="to_date">
                    To date:
                  </Label>
                  <Controller
                    name="to_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="to_date"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter to date"
                      />
                    )}
                  />
                  {errors.to_date && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.to_date.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === studyRoomReceiptId && (
              <div className="w-full hidden mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative ">
                  <Label className="font-normal" htmlFor="timing">
                    Timing:
                  </Label>
                  <Controller
                    name="timing"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="timing"
                        className="mt-1"
                        type="text"
                        placeholder="Enter timing"
                      />
                    )}
                  />
                  {errors.timing && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.timing.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === bharani_shradhhId && (
              <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative">
                  <Label className="font-normal" htmlFor="guruji">
                    Guruji Name: <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="guruji"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select guruji" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Guruji</SelectLabel>
                            {AllGurujisData?.Gurujis &&
                              AllGurujisData?.Gurujis.map((guruji) => (
                                <SelectItem value={String(guruji.guruji_name)}>
                                  {guruji.guruji_name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.guruji && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.guruji.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedReceiptTypeId === anteshteeReceiptId && (
              <div>
                <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                  <div className="relative">
                    <Label className="font-normal" htmlFor="guruji">
                      Guruji Name: <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="guruji"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select guruji" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select Guruji</SelectLabel>
                              {AllGurujisData?.Gurujis &&
                                AllGurujisData?.Gurujis.map((guruji) => (
                                  <SelectItem
                                    value={String(guruji.guruji_name)}
                                  >
                                    {guruji.guruji_name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.guruji && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.guruji.message}
                      </p>
                    )}
                  </div>
                  <div className="relative ">
                    <Label className="font-normal" htmlFor="yajman">
                      Yajman Name:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="yajman"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="yajman"
                          className="mt-1"
                          type="text"
                          placeholder="Enter name"
                        />
                      )}
                    />
                    {errors.yajman && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.yajman.message}
                      </p>
                    )}
                  </div>
                  <div className="relative ">
                    <Label className="font-normal" htmlFor="karma_number">
                      Karma No:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="karma_number"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="karma_number"
                          className="mt-1"
                          type="number"
                          placeholder="Enter karma no"
                        />
                      )}
                    />
                    {errors.karma_number && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.karma_number.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-5 gap-7 md:gap-4">
                  <div className="relative flex gap-2 mt-5 md:mt-0 md:pt-10 md:pl-2">
                    <Controller
                      name="day_9"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="day_9"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleAnteshteeCheckboxChange(e, "day_9_amount"); // Add 500 for Day 9
                          }}
                          type="checkbox"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="day_9">
                      Day 9
                    </Label>
                    {errors.day_9 && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.day_9.message}
                      </p>
                    )}
                  </div>
                  <div className="relative flex gap-2 mt-5 md:mt-0 md:pt-10 md:pl-2 ">
                    <Controller
                      name="day_10"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="day_10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleAnteshteeCheckboxChange(e, "day_10_amount"); // Add 500 for Day 9
                          }}
                          type="checkbox"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="day_10">
                      Day 10
                    </Label>
                    {errors.day_10 && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.day_10.message}
                      </p>
                    )}
                  </div>
                  <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                    <Controller
                      name="day_11"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="day_11"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleAnteshteeCheckboxChange(e, "day_11_amount"); // Add 500 for Day 9
                          }}
                          type="checkbox"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="day_11">
                      Day 11
                    </Label>
                    {errors.day_11 && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.day_11.message}
                      </p>
                    )}
                  </div>
                  <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                    <Controller
                      name="day_12"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="day_12"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleAnteshteeCheckboxChange(e, "day_12_amount"); // Add 500 for Day 9
                          }}
                          type="checkbox"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="day_12">
                      Day 12
                    </Label>
                    {errors.day_12 && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.day_12.message}
                      </p>
                    )}
                  </div>
                  <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                    <Controller
                      name="day_13"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="day_13"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleAnteshteeCheckboxChange(e, "day_13_amount"); // Add 500 for Day 9
                          }}
                          type="checkbox"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      )}
                    />
                    <Label className="font-normal" htmlFor="day_13">
                      Day 13
                    </Label>
                    {errors.day_13 && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.day_13.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full mb-4 md:mb-8 grid grid-cols-1 md:grid-cols-5 gap-7 md:gap-4">
                  {day9Checked && (
                    <div className="relative">
                      <Label className="font-normal" htmlFor="day_9_date">
                        Day 9 Date:
                      </Label>
                      <Controller
                        name="day_9_date"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="day_9_date"
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter date"
                          />
                        )}
                      />
                      {errors.day_9_date && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.day_9_date.message}
                        </p>
                      )}
                    </div>
                  )}
                  {day10Checked && (
                    <div className="relative">
                      <Label className="font-normal" htmlFor="day_10_date">
                        Day 10 Date:
                      </Label>
                      <Controller
                        name="day_10_date"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="day_10_date"
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter date"
                          />
                        )}
                      />
                      {errors.day_10_date && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.day_10_date.message}
                        </p>
                      )}
                    </div>
                  )}
                  {day11Checked && (
                    <div className="relative">
                      <Label className="font-normal" htmlFor="day_11_date">
                        Day 11 Date:
                      </Label>
                      <Controller
                        name="day_11_date"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="day_11_date"
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter date"
                          />
                        )}
                      />
                      {errors.day_11_date && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.day_11_date.message}
                        </p>
                      )}
                    </div>
                  )}
                  {day12Checked && (
                    <div className="relative">
                      <Label className="font-normal" htmlFor="day_12_date">
                        Day 12 Date:
                      </Label>
                      <Controller
                        name="day_12_date"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="day_12_date"
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter date"
                          />
                        )}
                      />
                      {errors.day_12_date && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.day_12_date.message}
                        </p>
                      )}
                    </div>
                  )}
                  {day13Checked && (
                    <div className="relative">
                      <Label className="font-normal" htmlFor="day_13_date">
                        Day 13 Date:
                      </Label>
                      <Controller
                        name="day_13_date"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            id="day_13_date"
                            className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                            type="date"
                            placeholder="Enter date"
                          />
                        )}
                      />
                      {errors.day_13_date && (
                        <p className="absolute text-red-500 text-sm mt-1 left-0">
                          {errors.day_13_date.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-4"></div>
              </div>
            )}

            {selectedReceiptTypeId === poojaReceiptId || showPooja ? (
              <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                <div className="relative">
                  <Label className="font-normal" htmlFor="pooja_type_id">
                    Pooja Type:<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="pooja_type_id"
                    control={control}
                    render={({ field }) => (
                      <Popover
                        open={openPoojaType}
                        onOpenChange={setOpenPoojaType}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPoojaType ? "true" : "false"} // This should depend on the popover state
                            className=" w-[325px] justify-between mt-1"
                            onClick={() => setOpenPoojaType((prev) => !prev)} // Toggle popover on button click
                          >
                            {field.value
                              ? allPoojaTypesData?.PoojaTypes &&
                                allPoojaTypesData?.PoojaTypes.find(
                                  (poojaType) => poojaType.id === field.value
                                )?.pooja_type
                              : "Select Pooja Type..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[325px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search pooja type..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No pooja type found.</CommandEmpty>
                              <CommandGroup>
                                {allPoojaTypesData?.PoojaTypes &&
                                  allPoojaTypesData?.PoojaTypes.map(
                                    (poojaType) => (
                                      <CommandItem
                                        key={poojaType.id}
                                        value={poojaType.id}
                                        onSelect={(currentValue) => {
                                          setValue(
                                            "pooja_type_id",
                                            poojaType.id
                                          );

                                          setOpenPoojaType(false);
                                          // Close popover after selection
                                        }}
                                      >
                                        {poojaType.pooja_type}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            poojaType.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    )
                                  )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.pooja_type_id && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.pooja_type_id.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Label className="font-normal" htmlFor="date">
                    date:<span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="date"
                        className="dark:bg-[var(--foreground)] mt-1 text-sm w-full p-2 pr-3 rounded-md border border-1"
                        type="date"
                        placeholder="Enter to date"
                      />
                    )}
                  />
                  {errors.date && (
                    <p className="absolute text-red-500 text-sm mt-1 left-0">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            {/* <div className="w-full grid grid-cols-1 md:grid-cols-6 items-center gap-7 md:gap-1">
              {selectedPoojaTypeId &&
                poojaDatesData?.PoojaDates?.map((poojaDate) => (
                  <div
                    key={poojaDate.id}
                    className="relative flex gap-2 md:pt-10 md:pl-2"
                  >
                    <input
                      type="checkbox"
                      id={poojaDate.pooja_date}
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Label
                      className="font-normal"
                      htmlFor={poojaDate.pooja_date}
                    >
                      {poojaDate.pooja_date}
                    </Label>
                  </div>
                ))}
            </div> */}

            {selectedReceiptTypeId === poojaPavtiAnekReceiptId && (
              <>
                <div className="w-full mb-4 md:mb-2 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
                  <div className="relative">
                    <Label className="font-normal" htmlFor="pooja_type_id">
                      Pooja Type:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="pooja_type_id"
                      control={control}
                      render={({ field }) => (
                        <Popover
                          open={openPoojaType}
                          onOpenChange={setOpenPoojaType}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openPoojaType ? "true" : "false"} // This should depend on the popover state
                              className=" w-[325px] justify-between mt-1"
                              onClick={() => setOpenPoojaType((prev) => !prev)} // Toggle popover on button click
                            >
                              {field.value
                                ? allPoojaTypesMultipleData?.PoojaTypes &&
                                  allPoojaTypesMultipleData?.PoojaTypes.find(
                                    (poojaType) => poojaType.id === field.value
                                  )?.pooja_type
                                : "Select Pooja Type..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[325px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search pooja type..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  No pooja type found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {allPoojaTypesMultipleData?.PoojaTypes &&
                                    allPoojaTypesMultipleData?.PoojaTypes.map(
                                      (poojaType) => (
                                        <CommandItem
                                          key={poojaType.id}
                                          value={poojaType.id}
                                          onSelect={(currentValue) => {
                                            setValue(
                                              "pooja_type_id",
                                              poojaType.id
                                            );
                                            setSelectedPoojaTypeId(
                                              poojaType.id
                                            );
                                            setOpenPoojaType(false);
                                            // Close popover after selection
                                          }}
                                        >
                                          {poojaType.pooja_type}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              poojaType.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      )
                                    )}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.pooja_type_id && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.pooja_type_id.message}
                      </p>
                    )}
                  </div>
                  {selectedReceiptTypeId === poojaPavtiAnekReceiptId &&
                    selectedPoojaTypeId && (
                      <div className="relative flex gap-2 md:pt-10 md:pl-2 ">
                        <Controller
                          name="selectAll"
                          control={control}
                          render={({ field }) => (
                            <input
                              id="selectAll"
                              {...field}
                              type="checkbox"
                              // onChange={() => {
                              //   setSelectAllCheckbox(!selectAllCheckbox);
                              // }}
                              checked={selectAllCheckbox} // Bind the state to the checkbox
                              onChange={handleSelectAllChange} // Use the updated function
                              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                          )}
                        />
                        <Label className="font-normal" htmlFor="selectAll">
                          Select All Date
                        </Label>
                        {errors.selectAll && (
                          <p className="absolute text-red-500 text-sm mt-1 left-0">
                            {errors.selectAll.message}
                          </p>
                        )}
                      </div>
                    )}
                </div>
              </>
            )}
            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-4 items-center gap-7 md:gap-1">
              {selectedReceiptTypeId === poojaPavtiAnekReceiptId &&
                selectedPoojaTypeId &&
                poojaDatesData?.PoojaDates?.map((poojaDate) => (
                  <div
                    key={poojaDate.id}
                    className="relative flex gap-2 md:pt-10 md:pl-2"
                  >
                    <input
                      type="checkbox"
                      id={poojaDate.pooja_date}
                      checked={selectedDates.includes(poojaDate.pooja_date)} // Check if date is in selectedDates array
                      onChange={(e) =>
                        handleCheckboxChange(e, poojaDate.pooja_date)
                      } //w
                      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Label
                      className="font-normal"
                      htmlFor={poojaDate.pooja_date}
                    >
                      {new Date(poojaDate.pooja_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </Label>
                  </div>
                ))}
            </div>

            <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-4">
              <div className="relative">
                <Label className="font-normal" htmlFor="payment_mode">
                  Payment Mode:<span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="payment_mode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setPaymentMode(value);
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select payent mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select payment mode</SelectLabel>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Bank">Bank</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.payment_mode && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.payment_mode.message}
                  </p>
                )}
              </div>

              {paymentMode === "UPI" && (
                <>
                  <div className="relative">
                    <Label className="font-normal" htmlFor="upi_number">
                      UTR Number:<span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="upi_number"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="upi_number"
                          className="mt-1"
                          type="text"
                          placeholder="Enter number"
                        />
                      )}
                    />
                    {errors.upi_number && (
                      <p className="absolute text-red-500 text-sm mt-1 left-0">
                        {errors.upi_number.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="relative md:col-start-3">
                <Label className="font-normal" htmlFor="amount">
                  Amount (Rs.):
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="amount"
                      className="mt-1"
                      type="number"
                      placeholder="Enter amount"
                    />
                  )}
                />
                {errors.amount && (
                  <p className="absolute text-red-500 text-sm mt-1 left-0">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>

            {/* row ends */}
            <div className="w-full gap-4 mt-6 flex justify-end items-center">
              <Button
                type="button"
                className="dark:text-white shadow-xl bg-red-600 hover:bg-red-700"
                onClick={() => navigate("/receipts")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className=" dark:text-white  shadow-xl bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> {/* Spinner */}
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;
