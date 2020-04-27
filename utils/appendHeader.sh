#!/usr/bin/env bash
year=2020
author=NazarenkoMaksym
header="/* Copyright (C) ${year} ${author}\n * \n*/\n"

gsed -i "1i ${header}" $1
