import { FC, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Tryout } from "@/models/model";
import TryoutRow from "./tryout-row";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { parse, isValid } from "date-fns";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { createTryout } from "@/app/action";
import { useToast } from "@/components/ui/use-toast";

interface TryoutListProps {
  tryouts: Tryout[] | null;
  onChatHistoryRowClicked: (id: string) => void;
}

export interface CreateTryoutForm {
  title: string;
  price: string;
  url: string;
  startedAt: string;
  endedAt: string;
  status: string;
}

const CreateTryoutSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title should have at least 3 characters"),
  price: Yup.string()
    .required("Price is required")
    .matches(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid number with up to two decimal places"
    ),
  url: Yup.string().required("URL is required").url("URL is not valid"),
  startedAt: Yup.string()
    .required("Start date is required")
    .test("is-iso-date", "Start date must be in ISO format", (value) => {
      const parsedDate = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
      return isValid(parsedDate);
    }),
  endedAt: Yup.string()
    .required("End date is required")
    .test("is-iso-date", "End date must be in ISO format", (value) => {
      const parsedDate = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
      return isValid(parsedDate);
    }),
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Not Published", "Published"], "Status must be 'Not Published'"),
});

const TryoutList: FC<TryoutListProps> = ({
  tryouts,
  onChatHistoryRowClicked,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [curTryout, setCurTryout] = useState(tryouts);
  const { toast } = useToast();

  useEffect(() => {
    if (searchValue.trim().length) {
      let newTryout = tryouts?.filter((tryout) => {
        const sv = searchValue.toLowerCase();
        return tryout.title.toLowerCase().includes(sv);
      });

      if (newTryout) {
        setCurTryout(newTryout);
      }
    } else {
      setCurTryout(tryouts);
    }
  }, [searchValue, tryouts]);

  const submitFormHandler = async (
    values: CreateTryoutForm,
    { setSubmitting }: FormikHelpers<CreateTryoutForm>
  ) => {
    setSubmitting(true);
    try {
      const formattedValues: CreateTryoutForm = {
        ...values,
        price: String(values.price),
        startedAt: new Date(values.startedAt).toISOString(),
        endedAt: new Date(values.endedAt).toISOString(),
        status: "Not Published",
      };
      await createTryout(formattedValues);

      document.getElementById("new-to-trigger")?.click();
      toast({
        title: "Success",
        description: "tryout is succesfully created",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "internal server error",
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  return (
    <div className="relative shrink basis-0 grow-[40] border-x">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-bold">Tryout</h1>
          <div className="inline-flex h-9 items-center justify-center rounded-lg p-1 text-muted-foreground ml-auto outline-none">
            <Dialog>
              <DialogTrigger
                id="new-to-trigger"
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                New Tryout
              </DialogTrigger>
              <DialogContent className="max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Create Tryout</DialogTitle>
                  <DialogDescription>
                    For Sheets URL, please copy{" "}
                    <Link
                      className="underline underline-offset-2"
                      href={
                        "https://docs.google.com/spreadsheets/d/1uJmqegKaEAS-V9Cko-_AJUQQPRbSSDibdRNgztaKgus/edit?usp=sharing"
                      }
                    >
                      this template
                    </Link>{" "}
                    and add{" "}
                    <span className="underline underline-offset-2">
                      sheets-api@online-tryout.iam.gserviceaccount.com
                    </span>{" "}
                    before upload create the tryout.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[500px] h-full flex flex-col gap-2 p-0">
                  <Formik
                    initialValues={{
                      title: "",
                      price: "",
                      url: "",
                      startedAt: "",
                      endedAt: "",
                      status: "Not Published",
                    }}
                    onSubmit={submitFormHandler}
                    validationSchema={CreateTryoutSchema}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="grid gap-2 p-2">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Name
                            </Label>
                            <div className="col-span-3">
                              <Field
                                name="title"
                                id="title"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Tryout Saintek"
                                type="text"
                              />
                              <div className="px-4 text-xs text-red-500">
                                <ErrorMessage name="title" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                              Price
                            </Label>
                            <div className="col-span-3">
                              <Field
                                name="price"
                                id="price"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Price in Rupiah"
                                type="number"
                              />
                              <div className="px-4 text-xs text-red-500">
                                <ErrorMessage name="price" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                              Sheets URL
                            </Label>
                            <div className="col-span-3">
                              <Field
                                name="url"
                                id="url"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Sheets URL"
                                type="text"
                              />
                              <div className="px-4 text-xs text-red-500">
                                <ErrorMessage name="url" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startedAt" className="text-right">
                              Started At
                            </Label>
                            <div className="col-span-3">
                              <Field
                                name="startedAt"
                                id="startedAt"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Start Date"
                                type="datetime-local"
                              />
                              <div className="px-4 text-xs text-red-500">
                                <ErrorMessage name="startedAt" />
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endedAt" className="text-right">
                              Ended At
                            </Label>
                            <div className="col-span-3">
                              <Field
                                name="endedAt"
                                id="endedAt"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="End Date"
                                type="datetime-local"
                              />
                              <div className="px-4 text-xs text-red-500">
                                <ErrorMessage name="endedAt" />
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="pt-4">
                            <Button
                              disabled={isSubmitting}
                              className="disable:cursor-not-allowed inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                              type="submit"
                            >
                              {isSubmitting ? (
                                <>
                                  <div
                                    className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                  />
                                  <span>Loading...</span>
                                </>
                              ) : (
                                "Submit"
                              )}
                            </Button>
                          </DialogFooter>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full"></div>

        <form className="p-4">
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <MagnifyingGlassIcon />
            </div>
            <input
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-8"
              placeholder="Search"
            />
          </div>
        </form>
      </div>

      <div
        className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"
        style={{ animationDuration: "0s" }}
      >
        <div
          className="relative h-full chat-container overflow-y-scroll max-h-[calc(100vh-120px)]"
          style={{ scrollbarColor: "#CFD8DC", scrollbarWidth: "thin" }}
        >
          <div className="w-full rounded-lg">
            <div className="min-w-full table">
              <div className="flex flex-col gap-2 p-4 pt-4">
                {curTryout?.map((tryout) => (
                  <div
                    key={tryout?.id}
                    onClick={() => {
                      onChatHistoryRowClicked(tryout.id);
                    }}
                  >
                    <TryoutRow tryout={tryout} />
                  </div>
                )) ?? []}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 m-0"></div>
    </div>
  );
};

TryoutList.displayName = "Chats History List";
export default TryoutList;
