#!/usr/bin/env perl

use Mojo::JSON;
use Mojo::Util qw/ encode slurp spurt /;
use Text::CSV;
use FindBin '$Bin';
use utf8::all;
use autodie;
use Data::Dumper;

# Read the input path and filename from STDIN
my $file = "$Bin/../_data/empresas_clean.csv";

# Read the output path and filename from STDIN
my $output_file = shift @ARGV;
die 'No output file specified' unless $output_file;

my $csv = Text::CSV->new({ binary => 1, eol => $/ });

open my $io, "<", $file;

my @data;
while ( my $row = $csv->getline ($io) ) {
    push @data, $row;
};

my $headers = shift @data;

my $json  = Mojo::JSON->new;
my $json = $json->encode({ aaData => [ @data ] });

# Write the output to a filehandle
spurt $json, $output_file;
